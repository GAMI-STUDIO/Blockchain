// 1. Import the Ethers plugin required to interact with the contract
require('@nomiclabs/hardhat-ethers');

// 2. Import your private key from your pre-funded Elysium testing account
const privateKey = "a14c8c147e9e0ef4b642a2884fd604eea117a04b8b4c2623b7ac32f462621bf1";

const rpc_url = "https://rpc.atlantischain.network";
const chain_id = 1338;


module.exports = {
    // 3. Specify the Solidity version
    solidity: '0.8.20',

    networks: {
        // 4. Add the Elysium Alpha network specification
        atlantis: {
            url: rpc_url,
            chainId: chain_id, // 0x507 in hex,
            accounts: [privateKey]
        }
    }
};








































// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox";
// import '@openzeppelin/hardhat-upgrades';

// import dotenv from 'dotenv'; 
// dotenv.config();

// const privateKey = process.env.PRIVATE_KEY_OWNER

// const config: HardhatUserConfig = {
//     solidity: {
//         compilers: [{
//           version: '0.8.23',
//           settings: {
//             optimizer: { enabled: true, runs: 1000000 },
//             viaIR: true
//           }
//         }]
//     },
//   etherscan: {
//       apiKey: {
//           neonevm: "test"
//       },
//       customChains: [
//           {
//               network: "neonevm",
//               chainId: 245022926,
//               urls: {
//                   apiURL: "https://devnet-api.neonscan.org/hardhat/verify",
//                   browserURL: "https://devnet.neonscan.org"
//               }
//           },
//           {
//               network: "neonevm",
//               chainId: 245022934,
//               urls: {
//                   apiURL: "https://api.neonscan.org/hardhat/verify",
//                   browserURL: "https://neonscan.org"
//               }
//           }
//       ]
//   },
//   networks: {
//       neondevnet: {
//           url: "https://devnet.neonevm.org",
//         //   accounts: [""],
//           chainId: 245022926,
//           allowUnlimitedContractSize: false,
//           gas: "auto",
//           gasPrice: "auto",
//       },
//       neonmainnet: {
//           url: "https://neon-proxy-mainnet.solana.p2p.org",
//         //   accounts: [""],
//           chainId: 245022934,
//           allowUnlimitedContractSize: false,
//           gas: "auto",
//           gasPrice: "auto",
//       }
//   }
// };

// export default config;
