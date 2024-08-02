import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import '@nomicfoundation/hardhat-ethers';
import 'dotenv/config';

const privateKey = process.env.PRIVATE_KEY_OWNER || "a14c8c147e9e0ef4b642a2884fd604eea117a04b8b4c2623b7ac32f462621bf1";
const rpc_url = "https://rpc.atlantischain.network";
const chain_id = 1338;

const config: HardhatUserConfig = {
    solidity: '0.8.20',
    networks: {
        atlantis: {
            url: rpc_url,
            chainId: chain_id,
            accounts: [privateKey],
            gasPrice: 20000000000, // 20 gwei
            gas: 3000000
        }
    }
};

export default config;
