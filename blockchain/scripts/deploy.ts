import { ethers } from "ethers";
import "dotenv/config";
import prizeContractJson from "./assets/Prize.json";

const PLAY_FEE = ethers.utils.parseEther("0.1");

const GAS_OPTIONS = {
  maxFeePerGas: 30 * 10 ** 9,
  maxPriorityFeePerGas: 30 * 10 ** 9,
};

function setupProvider() {
  const rpcUrl = process.env.CUSTOM_RPC_URL_MATIC;
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  return provider;
}

async function main() {
  // Set up wallet
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
  console.log(`Using address ${wallet.address}`);

  // Set up a provider
  const provider = setupProvider();

  // Printing connection URL
  const connectionUrl = provider.connection.url;
  console.log(
    `Connected to the node at ${connectionUrl.replace(
      /\w{25}$/,
      Array(25).fill("*").join("")
    )}`
  );

  // Printing network info
  const network = await provider.getNetwork();
  console.log(`Network name: ${network.name}\nChain Id: ${network.chainId}`);
  const lastBlock = await provider.getBlock("latest");
  console.log(`Connected at height: ${lastBlock.number}`);

  // Set up a signer
  const signer = wallet.connect(provider);

  // Printing wallet info
  let balanceBN = await signer.getBalance();
  let balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough network tokens");
  }

  // Setting the fees
  const maxFeePerGasGwei = ethers.utils.formatUnits(
    GAS_OPTIONS.maxFeePerGas,
    "gwei"
  );
  const maxPriorityFeePerGasGwei = ethers.utils.formatUnits(
    GAS_OPTIONS.maxPriorityFeePerGas,
    "gwei"
  );
  console.log(
    `Using ${maxFeePerGasGwei} maximum Gwei per gas unit and ${maxPriorityFeePerGasGwei} maximum Gwei of priority fee per gas unit`
  );

  // The next methods require network tokens to pay gas

  // Deploy prize contract contract
  console.log("Deploying Prize contract");
  const tokenFactory = new ethers.ContractFactory(
    prizeContractJson.abi,
    prizeContractJson.bytecode,
    signer
  );
  const prizeContract = await tokenFactory.deploy(GAS_OPTIONS);
  console.log("Awaiting confirmations");
  await prizeContract.deployed();
  console.log("Completed");
  console.log(`Contract deployed at ${prizeContract.address}`);

  // Play game
  console.log("Playing Game");
  const playTx = await prizeContract.play({ value: PLAY_FEE });
  await playTx.wait();

  balanceBN = await signer.getBalance();
  balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance after play ${balance}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
