import { expect } from "chai";
import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { Prize, Prize__factory } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { setTimeout } from "timers/promises";
import { latest } from "@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time";

describe("Prize Contract", async () => {
  let prizeContract: Prize;
  let deployer: SignerWithAddress;
  let player1: SignerWithAddress;
  let player2: SignerWithAddress;
  let playFee: BigNumber;
  let duration: BigNumber;

  beforeEach(async () => {
    [deployer, player1, player2] = await ethers.getSigners();

    const prizeContractFactory = new Prize__factory(deployer);
    prizeContract = await prizeContractFactory.deploy();
    await prizeContract.deployTransaction.wait();
    playFee = await prizeContract.fee();
    duration = await prizeContract.duration();
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
          .play({ value: playFee.mul(2) })) // Passing 2 * playFee.
          .to.be.revertedWith("Only the fee should be payed.");
      });

      it("Starts new game, updates game state and plays successfully.", async () => {
        // Values before playing
        expect(await prizeContract.isOpen()).to.be.eq(false);
        expect(await prizeContract.startTime()).to.be.eq(0);
        expect(await prizeContract.prizePool()).to.be.eq(0);
        const gameId = await prizeContract.gameId();


        // Plays emitting event.
        expect(await prizeContract.connect(player1).play({ value: playFee }))
          .to.emit(prizeContract, "Play")
          .withArgs(gameId, player1.address);;

        // Values after playing.
        expect(await prizeContract.isOpen()).to.be.eq(true);
        expect(await prizeContract.startTime()).not.to.be.eq(0);
        expect(await prizeContract.prizePool()).to.be.eq(playFee);
      });
    })

  });

  describe("When game is open", async () => {

    // So we have a game open before each test.
    beforeEach(async () => {
      await prizeContract.connect(player1).play({ value: playFee })
    })

    describe("Someone plays", async () => {
      it("reverts when you pay the wrong fee", async () => {
        await expect(prizeContract
          .connect(player1)
          .play({ value: playFee.mul(2) })) // Passing 2 * playFee.
          .to.be.revertedWith("Only the fee should be payed.");
      });

      it("Plays successfully and adds prize to prize pool", async () => {
        // Grab prize before playing.
        const prizePoolBefore: BigNumber = await prizeContract.prizePool()

        // Play game
        const playTx = await prizeContract
          .connect(player1)
          .play({ value: playFee })

        // Check fee was added to prize succesfully.
        expect(await prizeContract.prizePool()).to.be.equal(prizePoolBefore.add(playFee))
      })
    })

    describe("Someone submit score", async () => {
      const INITIAL_HC_GAME_AND_PLAYER: BigNumber = BigNumber.from(10)

      // So we have a non default score and personal highscore.
      beforeEach(async () => {
        await prizeContract.connect(player1).submitScore(INITIAL_HC_GAME_AND_PLAYER)
      })

      it("Updates game highscore and sets winner address when game highscore is beaten", async () => {
        // Get actual score
        const actualScore: BigNumber = await prizeContract.highestScore();
        const higherScore: BigNumber = actualScore.add(10);

        // Submit a highest score
        await prizeContract.connect(player1).submitScore(higherScore);

        // Check that address and high score were set.
        expect(await prizeContract.highestScore()).to.be.eq(higherScore);
        expect(await prizeContract.winnerAddress()).to.be.eq(player1.address);

      });

      it("Updates personal highscore when personal highscore is beat", async () => {
        // Get actual personal highest score
        const actualPersonalHighestScore: BigNumber = await prizeContract.highScores(player1.address);
        const personalHigherScore: BigNumber = actualPersonalHighestScore.add(10);

        // Submit a highest score
        await prizeContract.connect(player1).submitScore(personalHigherScore);

        // Check that personal highest score is updated.
        expect(await prizeContract.highScores(player1.address)).to.be.eq(personalHigherScore);
      });

      it("Maintains scores when submission is not personal nor game highscore", async () => {
        // Get actual score
        const actualGameHighestScore: BigNumber = await prizeContract.highestScore();
        const actualPersonalHighestScore: BigNumber = await prizeContract.highScores(player1.address);

        const notGameNorPersonalHigherScore: BigNumber = INITIAL_HC_GAME_AND_PLAYER.sub(1);

        // Submit a score that is not higher than personal nor game highest score.
        await prizeContract.connect(player1).submitScore(notGameNorPersonalHigherScore);

        // Check that address and high score stays equal.
        expect(await prizeContract.highestScore()).to.be.eq(actualGameHighestScore);
        expect(await prizeContract.highScores(player1.address)).to.be.eq(actualPersonalHighestScore);
      });
    });
  });

  describe("game is closed and it's not ended", async () => {
    const INITIAL_HC_GAME_AND_PLAYER: BigNumber = BigNumber.from(10)

    // So we have a non default score and personal highscore.
    beforeEach(async () => {
      // Start a game
      await prizeContract.connect(player1).play({ value: playFee })
      // Mark high score with player 1
      await prizeContract.connect(player1).submitScore(INITIAL_HC_GAME_AND_PLAYER)
      // Get latest block timemstamp.
      const latestBlock = (await ethers.provider.getBlock("latest")).timestamp
      // Set next blockTimestamp surpassing the duration.

      // TODO: CHECK HOW TO INCREASE TIMESTAMP FROM HARDHAT TESTS AND NOT WAITING.
      await time.setNextBlockTimestamp(latestBlock + duration.toNumber())
    })

    it("Plays", async () => {
      await expect(await prizeContract.connect(player1).play({ value: playFee })).to.be.revertedWith("Game must be open.");
      throw new Error("Not implemented");
    })

    it("Scores", async () => {
      await expect(await prizeContract.connect(player1).submitScore(INITIAL_HC_GAME_AND_PLAYER)).to.be.revertedWith("Game must be open.")
      throw new Error("Not implemented");
    })

    describe("Claims", async () => {
      it("As winner inside grace period", async () => {
        throw new Error("Not implemented");
      });

      // reverts.
      it("As anybody inside grace period", async () => {
        throw new Error("Not implemented");
      });

      it("As anybody outside grace period", async () => {
        throw new Error("Not implemented");
      });
    });
  });
});
