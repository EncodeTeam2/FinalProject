# Prize

Smart contract for our simple game where players stake bets and winner takes pot.

# Setup

Put your .env file at root. It should contain:

```env
PRIVATE_KEY=
CUSTOM_RPC_URL_MATIC=
ALCHEMY_API_KEY=
ETHERSCAN_API_KEY=
```

Install dependencies

```shell
yarn install
```

Compile contracts

```shell
yarn hardhat compile
```

# Test

Run tests for the contract

```shell
yarn hardhat test
```

# Hardhat Runtime Environment

Deploy to HRE.

```shell
yarn run ts-node --files ./scripts/hre/deploy.ts
```

Test expected flow inside HRE.

```shell
yarn run ts-node --files ./scripts/hre/completeTest.ts
```

# Deploy to Testnet

In order to properly deploy to a testnet, you need to have a funded account with desired testnet funds.

## Mumbai

```shell
yarn run ts-node --files ./scripts/mumbai/deploy.ts
```

## Sepolia

```shell
yarn run ts-node --files ./scripts/sepolia/deploy.ts
```

## Goerli

```shell
yarn run ts-node --files ./scripts/goerli/deploy.ts
```
