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

# Deploy to Hardhat Runtime Environment

```shell
yarn run ts-node --files ./scripts/hre/deploy.ts
```

# Deploy to Polygon Mumbai

In order to properly deploy to Polygon Mumbai, you need to have a funded account with MATIC. You can deploy the contract by running the following command:

```shell
yarn run ts-node --files ./scripts/mumbai/deploy.ts
```
