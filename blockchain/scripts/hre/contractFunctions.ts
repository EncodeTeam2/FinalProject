import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { attachToPrizeContract } from "../helpers"
import { BigNumber, ethers } from "ethers";


export async function play(contractAddress: string, signer: SignerWithAddress) {
    // Get instance of prizeContract
    const prizeContract = await attachToPrizeContract(contractAddress, signer)

    // Get playing fee.
    const fee = await prizeContract.fee();

    // Play paying correct fee.
    const claimTx = await prizeContract.play({ value: ethers.utils.parseEther(ethers.utils.formatEther(fee)) })

    const claimTxReceipt = await claimTx.wait()

    console.log(`
        Action: Play
        Player: ${signer.address}
        Tx hash: ${claimTxReceipt.transactionHash}
        Block: ${claimTxReceipt.blockNumber}
        Cost: ${ethers.utils.formatEther(claimTxReceipt.gasUsed.mul(claimTxReceipt.effectiveGasPrice))} ETH
        Confirmations: ${claimTxReceipt.confirmations}
    `)

}

export async function score(contractAddress: string, signer: SignerWithAddress, score: Number) {
    // Get instance of prizeContract
    const prizeContract = await attachToPrizeContract(contractAddress, signer)

    // Score amount.
    const scoreTx = await prizeContract.submitScore(BigNumber.from(score))

    const scoreTxReceipt = await scoreTx.wait()

    console.log(`
        Action: Submit Score
        Score: ${score}
        Player: ${signer.address}
        Tx hash: ${scoreTxReceipt.transactionHash}
        Block: ${scoreTxReceipt.blockNumber}
        Cost: ${ethers.utils.formatEther(scoreTxReceipt.gasUsed.mul(scoreTxReceipt.effectiveGasPrice))} ETH
        Confirmations: ${scoreTxReceipt.confirmations}
    `)
}

export async function claim(contractAddress: string, signer: SignerWithAddress) {
    // Get instance of prizeContract
    const prizeContract = await attachToPrizeContract(contractAddress, signer)

    // Claim funds.
    const claimTx = await prizeContract.claim()

    const claimTxReceipt = await claimTx.wait()

    console.log(`
        Action: Claim
        Player: ${signer.address}
        Tx hash: ${claimTxReceipt.transactionHash}
        Block: ${claimTxReceipt.blockNumber}
        Cost: ${ethers.utils.formatEther(claimTxReceipt.gasUsed.mul(claimTxReceipt.effectiveGasPrice))} ETH
        Confirmations: ${claimTxReceipt.confirmations}
    `)

}
