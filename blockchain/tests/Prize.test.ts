import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { BigNumber } from "ethers";
import { Prize, Prize__factory } from "../typechain-types";
import { time } from "console";

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
    // Could be reset or first go.

    it("Starts new game and updates game state", async () => {
      const gameState = await prizeContract.isOpen();
      expect(gameState).to.eq(true);
    });

    it("Adds timestamp to game stae", async () => {
      const gameTime = await prizeContract.startTime();
      expect(gameTime).to.not.eq(0);
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

  // describe("When its open", async () => {
  //   describe("When you are playing", async () => {
  //     // reverts
  //     it("msg.value different than expected from fee", async () => {
  //       throw new Error("Not implemented");
  //     });

  //     it("Plays successfully", async () => {
  //       throw new Error("Not implemented");
  //     });
  //   });

  //   describe("When you are submitting highscore", async () => {
  //     it("It's not a personal highscore nor game highscore", async () => {
  //       throw new Error("Not implemented");
  //     });

  //     it("It's not a personal highscore but it's game highscore", async () => {
  //       throw new Error("Not implemented");
  //     });

  //     it("It's a personal highscore but not game highscore", async () => {
  //       throw new Error("Not implemented");
  //     });

  //     it("It's a personal highscore and a game highscore", async () => {
  //       throw new Error("Not implemented");
  //     });
  //   });
  // });
});
