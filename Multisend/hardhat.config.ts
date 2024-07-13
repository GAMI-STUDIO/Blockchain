import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: {
          optimizer: { enabled: true, runs: 1000000 },
        },
      },
    ],
  },
  networks: {
    hardhat: {},
    atlantis: {
      url: "https://rpc.atlantischain.network",
      chainId: 1338,
      accounts: [
        `0xa14c8c147e9e0ef4b642a2884fd604eea117a04b8b4c2623b7ac32f462621bf1`,
      ], // Replace with process.env.PRIVATE_KEY_OWNER if using dotenv
    },
  },
};

export default config;
