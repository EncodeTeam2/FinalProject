import { ethers } from "hardhat";
import { Prize, Prize__factory } from "../../typechain-types";

async function deployPrize() {
    //  connected to localhost blockchain
    const provider = ethers.provider;

    // Get accounts signers
    const accounts = await ethers.getSigners();

    console.log("Deploying Prize Smart Contract...");
    console.log("Waiting for confirmation...");

    // Deploy prize contract as account[0].
    const prizeFactory = new Prize__factory(accounts[0])
    let prizeContract = await prizeFactory.deploy() as Prize;
    const txPrizeReceipt = await prizeContract.deployTransaction.wait();

    console.log(`
        Contract Name: Prize
        Action: Deploy
        Network: Hardhat Runtime Environment
        Deployer: ${txPrizeReceipt.from}
        Tx hash: ${txPrizeReceipt.transactionHash}
        Contract Address: ${txPrizeReceipt.contractAddress}
        Cost: ${ethers.utils.formatEther(txPrizeReceipt.gasUsed.mul(txPrizeReceipt.effectiveGasPrice))} ETH
        Block: ${txPrizeReceipt.blockNumber}
        Confirmations: ${txPrizeReceipt.confirmations}
    `)

}

deployPrize().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
