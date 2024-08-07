# Knockout Wars Game Contracts

## Introduction

Welcome to the official repository for Knockout Wars game contracts, developed by Gami Studio. This repository houses essential components for the game's ecosystem:

1. **NFT ERC1155 Contract**: For visual elements in the game and unique in-game perks.
2. **Safe**: Using Gnosis safes wallet contracts
3. **ERC20 Token**: Features our game's utility token with distinct functionalities to support the game's economy and player interactions. (CODE YET TO BE FINALIZED AND ADDED)

## ERC20 Token Features

[WIP] Our ERC20 token is still a work in progress and is designed with six distinct features to support the game's economy and enhance player experience:

- **Transaction Fee (1.5%)**: Applied on all transactions to fund various aspects of the game's ecosystem.
  - **Reflection (0.6%)**: Distributed among token holders to reward them for their participation.
  - **Liquidity (0.4%)**: Allocated to an AMM to ensure constant liquidity.
  - **Burning (0.3%)**: Used to decrease the total supply, potentially increasing the token's value over time.
  - **Fee Treasury (0.2%)**: Supports operational expenses, primarily gas fees for player transactions.
  - **Minting & Burning for Bridging**: Facilitates token portability across different blockchains.

## How It Works

### Player Onboarding and Wallet Management

- Upon signing up, players receive a wallet, which will be used for all in-game activities unless they opt for their own custodial wallet.
- Smart contract wallets allow free transactions for players, with gas fees covered by the treasury.
- Players using their custodial wallets must ensure they have the native chain token for gas.
- Players can switch between wallets at any time and transfer assets freely between their Smart contract and custodial wallets.

### Wallet Usage and Gas Fees

- The Smart contract wallet system ensures that new and casual players can participate in the game without worrying about transaction fees.
- The fee treasury mechanism, funded by the ERC20 token transaction fees, underpins this feature, ensuring a sustainable model for covering in-game transaction costs.

## Features

- **Visual NFTs**: Enhance your game with unique, visually appealing assets that come with exclusive in-game perks.
- **ERC1155 Standard**: Utilizing the flexible and efficient ERC1155 standard for managing multi-token types.
- **Smart Contract Account**: Streamline the player onboarding process with automated wallet addresses for new sign-ups and personal wallet integration.

## Final Notes: Pending Items and ERC20 Token Update

As we advance towards finalizing the infrastructure of Knockout Wars, we aim to ensure the utmost security and functionality of our smart contracts. To achieve this, we are focusing on the following development and testing phases:

### Smart Contract Testing

1. **Unit Testing**: Comprehensive testing to verify all functionalities of the smart contracts under various conditions.
2. **Fuzz Testing**: Employing fuzz testing to uncover any hidden bugs by bombarding the contracts with random data.
3. **Fork Testing**: Testing the smart contracts on a mainnet fork to evaluate performance and security in a real-world-like environment.
4. **Slither Testing**: Using Slither for static analysis to identify potential security vulnerabilities and ensure best practices are followed.

### ERC20 Token

Additionally, we are thrilled to announce that our ERC20 token development is nearing completion. This token will introduce several innovative features to the Knockout Wars ecosystem


npm cache clean --force
npm install --legacy-peer-deps
npm run compile


