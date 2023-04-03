import "dotenv/config";
import { ethers } from 'ethers';

// Setups Polygon Mumbai Provider
function setupMumbaiProvider(rpcUrl: string | undefined): ethers.providers.JsonRpcProvider {
    return new ethers.providers.JsonRpcProvider(rpcUrl);
}

// Returns wallet connected to given provider.
export function configureWallet(network: string, privateKey: string | undefined): ethers.Wallet {
    if (!privateKey || privateKey.length <= 0) {
        throw new Error("Missing private key")
    }

    let provider: ethers.providers.BaseProvider

    // Get default provider for provided network
    if (network != "mumbai") {
        provider = ethers.providers.getDefaultProvider(network, {
            // Provide personal keys from environment.
            alchemy: process.env.ALCHEMY_API_KEY,
            etherscan: process.env.ETHERSCAN_API_KEY,
            infura: {
                projectId: process.env.INFURA_API_KEY,
                projectSecret: process.env.INFURA_API_SECRET,
            }
        })
    } else {
        provider = setupMumbaiProvider(process.env.CUSTOM_RPC_URL_MATIC)
    }

    // return wallet connected to desired provider.
    return new ethers.Wallet(privateKey, provider)

}
