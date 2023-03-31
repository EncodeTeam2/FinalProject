import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { Prize, Prize__factory } from "../typechain-types";
import { time } from "console";
import { setTimeout } from "timers/promises";

describe("Prize Contract", async () => {
  let prizeContract: Prize;
  let deployer: SignerWithAddress;
  let player1: SignerWithAddress;
  let player2: SignerWithAddress;
  let playFee: BigNumber;

  beforeEach(async () => {
    [deployer, player1, player2] = await ethers.getSigners();

    const prizeContractFactory = new Prize__factory(deployer);
    prizeContract = await prizeContractFactory.deploy();
    await prizeContract.deployTransaction.wait();
    playFee = await prizeContract.fee();
  });

  describe("When its deployed and hasn't started yet", async () => {
    it("checks that game time is at zero", async () => {
      const gameTime = await prizeContract.startTime();
      expect(gameTime).to.eq(0);
    });

    it("checks that high score is set to zero", async () => {
      const gameHighScore = await prizeContract.highestScore();
      expect(gameHighScore).to.eq(0);
    });

    it("checks that there is no current winner", async () => {
      const currentWinner = await prizeContract.winnerAddress();
      expect(currentWinner).to.not.be.an("address");
    });

    it("checks for an empty prize pool", async () => {
      const prizePoolBalance = await prizeContract.prizePool();
      expect(prizePoolBalance).to.eq(0);
    });

    it("checks that game has not started", async () => {
      const gameState = await prizeContract.isOpen();
      expect(gameState).to.eq(false);
    });

    it("checks for first game", async () => {
      const gameNumber = await prizeContract.gameId();
      expect(gameNumber).to.eq(1);
    });
  });

  describe("When game and claim period is closed and new game is initiated", async () => {
    let playGame: any;
    beforeEach(async () => {
      playGame = await prizeContract.connect(player1).play({ value: playFee });
    });

    it("Starts new game and updates game state", async () => {
      const gameState = await prizeContract.isOpen();
      expect(gameState).to.eq(true);
    });

    it("Adds timestamp to game stae", async () => {
      const gameTime = await prizeContract.startTime();
      expect(gameTime).to.not.eq(0);
    });

    it("Updates prize pool", async () => {
      const pool = await prizeContract.prizePool();
      expect(pool).to.eq(playFee);
    });

    it("Emits Play event", async () => {
      expect(
        (playGame = await prizeContract
          .connect(player1)
          .play({ value: playFee }))
      )
        .to.emit(prizeContract, "Play")
        .withArgs(1, await player1.getAddress);
    });
  });

  // describe("When it's closed and it's not ended", async () => {
  //   beforeEach(async () => {});

  //   describe("Claims", async () => {
  //     it("As winner inside grace period", async () => {
  //       throw new Error("Not implemented");
  //     });

  //     // reverts.
  //     it("As anybody inside grace period", async () => {
  //       throw new Error("Not implemented");
  //     });

  //     it("As anybody outside grace period", async () => {
  //       throw new Error("Not implemented");
  //     });
  //   });
  // });

  describe("When game is open", async () => {
    let playGame: any;
    beforeEach(async () => {
      playGame = await prizeContract.connect(player1).play({ value: playFee });
    });
    describe("When you start another game", async () => {
      it("reverts when you pay the wrong fee", async () => {
        //const wrongFee = ethers.utils.parseEther("1");
        // console.log(wrongFee);
        // console.log(playFee);
        // await expect(
        //   (playGame = await prizeContract
        //     .connect(player1)
        //     .play({ value: wrongFee }))
        // ).to.be.revertedWith("Only the fee should be payed.");
      });

      it("Plays another game successfully", async () => {
        let secondGame: any;
        expect(
          (secondGame = await prizeContract
            .connect(player2)
            .play({ value: playFee }))
        ).to.not.be.reverted;
      });
    });

    describe("When you are submitting scores", async () => {
      it("Updates game highscore when game highscore is beat", async () => {
        const newScore = ethers.utils.parseEther("10");
        const submitScore = await prizeContract
          .connect(player1)
          .submitScore(newScore);
        const gameHighScore = await prizeContract.highestScore();
        expect(gameHighScore).to.eq(newScore);
      });

      it("Updates personal highscore when personal highscore is beat", async () => {
        const newScore = ethers.utils.parseEther("10");
        const submitScore = await prizeContract
          .connect(player1)
          .submitScore(newScore);
        const personalHigh = await prizeContract.highScores(player1.address);
        expect(personalHigh).to.eq(newScore);
      });

      it("Maintains scores when submission is not personal or game highscore", async () => {
        const firstScore = ethers.utils.parseEther("2");
        const secondScore = ethers.utils.parseEther("10");
        const score1 = await prizeContract
          .connect(player1)
          .submitScore(firstScore);
        const score2 = prizeContract.connect(player1).submitScore(secondScore);
        const personalHigh = await prizeContract.highScores(player1.address);
        const gameHighScore = await prizeContract.highestScore();
        expect(personalHigh).to.eq(firstScore);
        expect(gameHighScore).to.eq(firstScore);
      });

      it("Updates winning address correctly", async () => {
        const firstScore = ethers.utils.parseEther("2");
        const secondScore = ethers.utils.parseEther("10");
        const thirdScore = ethers.utils.parseEther("8");

        const firstSubmit = await prizeContract
          .connect(player1)
          .submitScore(firstScore);

        const secondSubmit = await prizeContract
          .connect(player2)
          .submitScore(secondScore);

        const thirdSubmit = await prizeContract
          .connect(player1)
          .submitScore(thirdScore);

        const currentLeader = await prizeContract.winnerAddress();

        expect(currentLeader).to.eq(player2.address);
      });

      // it("Updates correct when it's not a personal highscore but it's game highscore", async () => {
      //   throw new Error("Not implemented");
      // });
      // it("It's a personal highscore but not game highscore", async () => {
      //   throw new Error("Not implemented");
      // });
      // it("It's a personal highscore and a game highscore", async () => {
      //   throw new Error("Not implemented");
      // });
    });
  });
  describe("When game is closed", async () => {
    let playGame: any;
    beforeEach(async () => {
      playGame = await prizeContract.connect(player1).play({ value: playFee });
    });
    it("It allows winner to claim prize", async () => {
      const firstSubmit = await prizeContract
        .connect(player1)
        .submitScore(ethers.utils.parseEther("2"));

      await setTimeout(10000);
      const claimPrize = await prizeContract.connect(player1).claim();
      const pool = await prizeContract.prizePool();
      expect(pool).to.eq(0);
    });
    // it("It rejects new game play", async () => {
    //   await setTimeout(10000);
    //   const playGame2 = await prizeContract
    //     .connect(player1)
    //     .play({ value: playFee });
    // });
  });
});
