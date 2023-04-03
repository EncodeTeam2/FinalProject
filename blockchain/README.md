# Prize

Smart contract for our simple game where players stake bets and winner takes pot.

# Setup

Put your .env file at root. It should contain:

```env
INFURA_API_KEY=
INFURA_API_SECRET=
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

# Deploy to Polygon Mumbai

In order to properly deploy to Polygon Mumbai, you need to have a funded account. You can deploy the contracts to Polygon Mumbai by running the following command:

```shell
yarn run ts-node --files
```
