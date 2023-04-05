import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { Prize, Prize__factory } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { setTimeout } from "timers/promises";
import { latest } from "@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time";
import { Provider } from "@ethersproject/providers";

const PLAYING_FEE: BigNumber = ethers.utils.parseEther("0.1")
const DURATION: BigNumber = BigNumber.from(30) // 30 secs.


describe("Prize Contract", async () => {
  let prizeContract: Prize;
  let deployer: SignerWithAddress;
  let player1: SignerWithAddress;
  let player2: SignerWithAddress;

  beforeEach(async () => {
    [deployer, player1, player2] = await ethers.getSigners();

    const prizeContractFactory = new Prize__factory(deployer);
    prizeContract = await prizeContractFactory.deploy(DURATION, PLAYING_FEE);
    await prizeContract.deployTransaction.wait();
  });

  describe("When its deployed and hasn't started yet", async () => {
    it("checks that all state variables contain default values", async () => {
      const gameTime = await prizeContract.startTime();
      const gameHighScore = await prizeContract.highestScore();
      const currentWinner = await prizeContract.winnerAddress();
      const prizePoolBalance = await prizeContract.prizePool();
      const gameState = await prizeContract.isOpen();
      const gameNumber = await prizeContract.gameId();
      expect(gameTime).to.eq(0);
      expect(gameHighScore).to.eq(0);
      expect(currentWinner).to.be.equal(ethers.constants.AddressZero);
      expect(prizePoolBalance).to.eq(0);
      expect(gameState).to.eq(false);
      expect(gameNumber).to.eq(1);
    });
  });

  describe("When game is closed and ended", async () => {
    describe("Someone plays", async () => {
      it("reverts when you pay the wrong fee", async () => {
        await expect(prizeContract
          .connect(player1)
          .play({ value: PLAYING_FEE.mul(2) })) // Passing 2 * playFee.
          .to.be.revertedWith("Only the fee should be payed.");
      });

      it("Starts new game, updates game state and plays successfully.", async () => {
        // Values before playing
        expect(await prizeContract.isOpen()).to.be.eq(false);
        expect(await prizeContract.startTime()).to.be.eq(0);
        expect(await prizeContract.prizePool()).to.be.eq(0);
        const gameId = await prizeContract.gameId();


        // Plays emitting event.
        expect(await prizeContract.connect(player1).play({ value: PLAYING_FEE }))
          .to.emit(prizeContract, "Play")
          .withArgs(gameId, player1.address);;

        // Values after playing.
        expect(await prizeContract.isOpen()).to.be.eq(true);
        expect(await prizeContract.startTime()).not.to.be.eq(0);
        expect(await prizeContract.prizePool()).to.be.eq(PLAYING_FEE);
      });
    })

  });

  describe("When game is open", async () => {

    // So we have a game open before each test.
    beforeEach(async () => {
      await prizeContract.connect(player1).play({ value: PLAYING_FEE })
    })

    describe("Someone plays", async () => {
      it("reverts when you pay the wrong fee", async () => {
        await expect(prizeContract
          .connect(player1)
          .play({ value: PLAYING_FEE.mul(2) })) // Passing 2 * playFee.
          .to.be.revertedWith("Only the fee should be payed.");
      });

      it("Plays successfully and adds prize to prize pool", async () => {
        // Grab prize before playing.
        const prizePoolBefore: BigNumber = await prizeContract.prizePool()

        // Play game
        const playTx = await prizeContract
          .connect(player1)
          .play({ value: PLAYING_FEE })

        // Check fee was added to prize succesfully.
        expect(await prizeContract.prizePool()).to.be.equal(prizePoolBefore.add(PLAYING_FEE))
      })
    })

    describe("Someone submit score", async () => {
      const INITIAL_HC_GAME_AND_PLAYER: number = 10

      // So we have a non default score and personal highscore.
      beforeEach(async () => {
        await prizeContract.connect(player1).submitScore(INITIAL_HC_GAME_AND_PLAYER)
      })

      it("Updates game highscore and sets winner address when game highscore is beaten", async () => {
        // Get actual score
        const actualScore: number = await prizeContract.highestScore();
        const higherScore: number = actualScore + 10;

        // Submit a highest score
        await prizeContract.connect(player1).submitScore(higherScore);

        // Check that address and high score were set.
        expect(await prizeContract.highestScore()).to.be.eq(higherScore);
        expect(await prizeContract.winnerAddress()).to.be.eq(player1.address);

      });

      it("Updates personal highscore when personal highscore is beat", async () => {
        // Get actual personal highest score
        const actualPersonalHighestScore: number = await prizeContract.highScores(player1.address);
        const personalHigherScore: number = actualPersonalHighestScore + 10;

        // Submit a highest score
        await prizeContract.connect(player1).submitScore(personalHigherScore);

        // Check that personal highest score is updated.
        expect(await prizeContract.highScores(player1.address)).to.be.eq(personalHigherScore);
      });

      it("Maintains scores when submission is not personal nor game highscore", async () => {
        // Get actual score
        const actualGameHighestScore: number = await prizeContract.highestScore();
        const actualPersonalHighestScore: number = await prizeContract.highScores(player1.address);

        const notGameNorPersonalHigherScore: number = INITIAL_HC_GAME_AND_PLAYER - 1;

        // Submit a score that is not higher than personal nor game highest score.
        await prizeContract.connect(player1).submitScore(notGameNorPersonalHigherScore);

        // Check that address and high score stays equal.
        expect(await prizeContract.highestScore()).to.be.eq(actualGameHighestScore);
        expect(await prizeContract.highScores(player1.address)).to.be.eq(actualPersonalHighestScore);
      });
    });

    describe("Someone claims", async () => {
      it("reverts", async () => {
        await expect(prizeContract
          .connect(player1)
          .claim())
          .to.be.revertedWith("Game must be closed.");
      });
    });
  });


  describe("game is closed and it's not ended", async () => {
    const INITIAL_HC_GAME_AND_PLAYER: BigNumber = BigNumber.from(10)

    // So we have a non default score and personal highscore.
    beforeEach(async () => {
      // Start a game
      await prizeContract.connect(player1).play({ value: PLAYING_FEE })
      // Mark high score with player 1
      await prizeContract.connect(player1).submitScore(INITIAL_HC_GAME_AND_PLAYER)
      // Close the game increasing duration + 10 to the block timestamp.
      await time.increase(DURATION.add(10));
    })

    describe("Plays", async () => {
      it("Reverts", async () => {
        await expect(prizeContract.connect(player1).play({ value: PLAYING_FEE })).to.be.revertedWith("Game must be open.");
      })
    })


    describe("Scores", async () => {
      it("Reverts", async () => {
        await expect(prizeContract.connect(player1).submitScore(INITIAL_HC_GAME_AND_PLAYER)).to.be.revertedWith("Game must be open.")
      })
    })

    describe("Claims", async () => {
      it("Successfully as winner inside grace period", async () => {
        // Get balances before.
        const accountBalanceBefore: BigNumber = await player1.getBalance()
        const contractPoolBefore: BigNumber = await prizeContract.prizePool()

        // Claim.
        const claimTx = await prizeContract.connect(player1).claim()
        const claimTxReceipt = await claimTx.wait()

        // Get balances after (include fee).
        const accountBalanceAfter: BigNumber = await player1.getBalance()
        const contractPoolAfter: BigNumber = await prizeContract.prizePool()
        const txFee: BigNumber = claimTxReceipt.gasUsed.mul(claimTxReceipt.effectiveGasPrice)

        expect(accountBalanceAfter).to.be.equal(accountBalanceBefore.add(contractPoolBefore).sub(txFee))
        expect(contractPoolAfter).to.be.equal(0)
      });

      it("Reverting as anybody inside grace period", async () => {
        await expect(prizeContract.connect(player2).claim()).to.be.revertedWith("Grace period for the winner still running.")
      });

      it("Successfully as anybody outside grace period", async () => {
        // Close the grace period.
        await time.increase(DURATION.mul(2));

        // Get balances before.
        const accountBalanceBefore: BigNumber = await player2.getBalance()
        const contractPoolBefore: BigNumber = await prizeContract.prizePool()

        // Claim.
        const claimTx = await prizeContract.connect(player2).claim()
        const claimTxReceipt = await claimTx.wait()

        // Get balances after (include fee).
        const accountBalanceAfter: BigNumber = await player2.getBalance()
        const contractPoolAfter: BigNumber = await prizeContract.prizePool()
        const txFee: BigNumber = claimTxReceipt.gasUsed.mul(claimTxReceipt.effectiveGasPrice)

        expect(accountBalanceAfter).to.be.equal(accountBalanceBefore.add(contractPoolBefore).sub(txFee))
        expect(contractPoolAfter).to.be.equal(0)

      });
    });
  });
});
