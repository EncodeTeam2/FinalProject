import { ethers } from "hardhat";
import { deployPrize } from "./deploy";
import { claim, play, score } from "./contractFunctions";
import { expect } from "chai";
import { attachToPrizeContract } from "../helpers";
import { BigNumber } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";


async function completeTest() {
    //  connected to localhost blockchain
    const provider = ethers.provider;

    // Get accounts signers
    const accounts = await ethers.getSigners();

    // Deploy contract and get contract address
    const contractAddress: string = await deployPrize();

    // Prize contract instance just to use for expecting values.
    const prizeContract = await attachToPrizeContract(contractAddress, accounts[3])

    const PLAY_FEE: BigNumber = await prizeContract.fee()
    const LOOSER_SCORE: Number = 10
    const WINNER_SCORE: Number = 100
    const LOOSER: SignerWithAddress = accounts[1]
    const WINNER: SignerWithAddress = accounts[0]
    const DURATION: number = await prizeContract.duration();

    // Check game is closed before someone plays.
    expect(await prizeContract.isOpen()).to.be.equal(false)
    expect(await prizeContract.startTime()).to.be.equal(0)

    // Play as looser
    await play(contractAddress, LOOSER)

    // Check game was opened after looser played.
    expect(await prizeContract.isOpen()).to.be.equal(true)
    expect(await prizeContract.startTime()).not.to.be.equal(0)
    expect(await prizeContract.prizePool()).to.be.equal(PLAY_FEE)

    // Score as looser
    await score(contractAddress, LOOSER, LOOSER_SCORE)

    // Check looser updated both game and personal highscores. Also he should be the winner.
    expect(await prizeContract.highestScore()).to.be.equal(LOOSER_SCORE)
    expect(await prizeContract.highScores(LOOSER.address)).to.be.equal(LOOSER_SCORE)
    expect(await prizeContract.winnerAddress()).to.be.equal(LOOSER.address)

    // Play as winner
    await play(contractAddress, WINNER)

    // Check prize pool updates correctly
    expect(await prizeContract.prizePool()).to.be.equal(PLAY_FEE.mul(2))

    // Score as winner
    await score(contractAddress, WINNER, WINNER_SCORE)

    // Check winner updates both game and personal highscores. Also he should be the winner now.
    expect(await prizeContract.highestScore()).to.be.equal(WINNER_SCORE)
    expect(await prizeContract.highScores(WINNER.address)).to.be.equal(WINNER_SCORE)
    expect(await prizeContract.winnerAddress()).to.be.equal(WINNER.address)

    // Try to claim as winner before ended.
    await expect(claim(contractAddress, WINNER)).to.be.revertedWith("Game must be closed.")

    // End 
    await time.increase(DURATION + 10);

    // Try to play and score as looser after game ended.
    await expect(play(contractAddress, LOOSER)).to.be.revertedWith("Game must be open.")
    await expect(score(contractAddress, LOOSER, WINNER_SCORE)).to.be.revertedWith("Game must be open.")

    // Try to claim as looser after ended inside grace period.
    await expect(claim(contractAddress, LOOSER)).to.be.revertedWith("Grace period for the winner still running.")

    // End grace period 
    await time.increase(DURATION + 10);

    // Claim as looser after grace period.
    await claim(contractAddress, LOOSER)

    // Check funds where withdrawn and game ended successfully.
    expect(await prizeContract.prizePool()).to.be.equal(0)
    expect(await prizeContract.isOpen()).to.be.equal(false)
    expect(await prizeContract.startTime()).to.be.equal(0)

    // Check game restarts successfully playing again as looser.
    await play(contractAddress, LOOSER)

    // Check that game was restarted successfully.
    expect(await prizeContract.isOpen()).to.be.equal(true)
    expect(await prizeContract.startTime()).not.to.be.equal(0)
    expect(await prizeContract.prizePool()).to.be.equal(PLAY_FEE)
}


completeTest().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

