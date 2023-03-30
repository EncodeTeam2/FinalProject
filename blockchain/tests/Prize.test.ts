import { expect } from "chai";
import { ethers } from "hardhat";

describe("Prize bla bla", async () => {
  beforeEach(async () => { });

  describe("When its deployed and hasn't started yet", async () => {
    it("checks that state is correct", async () => {
      // Check that all variables are default.
      throw new Error("Not implemented");
    });
  });

  describe("When it's closed and it's ended", async () => {
    beforeEach(async () => { });
    // Could be reset or first go.
    it("Starts new game", async () => {
      // set is open to true
      // set startTime to block.timestamp
      // emit Start event with correct gameId and msg.sender.
      // Add 1 to gameId
      throw new Error("Not implemented");
    });
  });

  describe("When it's closed and it's not ended", async () => {
    beforeEach(async () => { });

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
    })
  });

  describe("When its open", async () => {

    describe("When you are playing", async () => {
      // reverts
      it("msg.value different than expected from fee", async () => {
        throw new Error("Not implemented");
      });

      it("Plays successfully", async () => {
        throw new Error("Not implemented");
      });
    });


    describe("When you are submitting highscore", async () => {
      it("It's not a personal highscore nor game highscore", async () => {
        throw new Error("Not implemented");
      });

      it("It's not a personal highscore but it's game highscore", async () => {
        throw new Error("Not implemented");
      });

      it("It's a personal highscore but not game highscore", async () => {
        throw new Error("Not implemented");
      });

      it("It's a personal highscore and a game highscore", async () => {
        throw new Error("Not implemented");
      });
    });
  });
});
