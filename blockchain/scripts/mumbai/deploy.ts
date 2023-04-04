import { BigNumber, ethers } from "ethers";
import { configureWallet } from "../helpers";
import { Prize, Prize__factory } from "../../typechain-types";
import "dotenv/config";

const PLAYING_FEE: BigNumber = ethers.utils.parseEther("0.1")
const DURATION: BigNumber = BigNumber.from(30) // 30 secs.

async function deployPrize() {
    // Create a wallet instance connected to desired network.
    const myWallet: ethers.Wallet = configureWallet("mumbai", process.env.PRIVATE_KEY);

    console.log("Deploying Prize Smart Contract...");
    console.log("Waiting for confirmation...");

    // Deploy Tokenized Ballot contract
    const prizeContractFactory = new Prize__factory(myWallet)
    let prizeContract = await prizeContractFactory.deploy(DURATION, PLAYING_FEE) as Prize;
    const txPrizeReceipt = await prizeContract.deployTransaction.wait();

    console.log(`
        Contract Name: Prize
        Action: Deploy
        Network: Mumbai
        Deployer: ${txPrizeReceipt.from}
        Tx hash: ${txPrizeReceipt.transactionHash}
        Contract Address: ${txPrizeReceipt.contractAddress}
        Cost: ${ethers.utils.formatEther(txPrizeReceipt.gasUsed.mul(txPrizeReceipt.effectiveGasPrice))} MATIC
        Block: ${txPrizeReceipt.blockNumber}
        Confirmations: ${txPrizeReceipt.confirmations}
    `)
}


deployPrize().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
