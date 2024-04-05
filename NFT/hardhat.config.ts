import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';

import dotenv from 'dotenv'; 
dotenv.config();

const privateKey = process.env.PRIVATE_KEY_OWNER || ''

const config: HardhatUserConfig = {
    solidity: {
        compilers: [{
          version: '0.8.23',
          settings: {
            optimizer: { enabled: true, runs: 1000000 },
            viaIR: true
          }
        }]
    },
  etherscan: {
      apiKey: {
          neonevm: "test"
      },
      customChains: [
          {
              network: "neonevm",
              chainId: 245022926,
              urls: {
                  apiURL: "https://devnet-api.neonscan.org/hardhat/verify",
                  browserURL: "https://devnet.neonscan.org"
              }
          },
          {
              network: "neonevm",
              chainId: 245022934,
              urls: {
                  apiURL: "https://api.neonscan.org/hardhat/verify",
                  browserURL: "https://neonscan.org"
              }
          }
      ]
  },
  networks: {
      neondevnet: {
          url: "https://devnet.neonevm.org",
          accounts: [privateKey],
          chainId: 245022926,
          allowUnlimitedContractSize: false,
          gas: "auto",
          gasPrice: "auto",
      },
      neonmainnet: {
          url: "https://neon-proxy-mainnet.solana.p2p.org",
          accounts: [privateKey],
          chainId: 245022934,
          allowUnlimitedContractSize: false,
          gas: "auto",
          gasPrice: "auto",
      }
  }
};

export default config;
