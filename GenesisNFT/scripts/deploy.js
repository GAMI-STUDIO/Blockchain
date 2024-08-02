const { ethers } = require("ethers");
const artifacts = require("./artifacts/contracts/GenesisNFT/GenesisNFT.sol/GenesisNFT.json");
// Initialize provider

const networks = {
    rpc_url: "https://rpc.atlantischain.network",
    chain_id: 1338

}
const privateKey = "a14c8c147e9e0ef4b642a2884fd604eea117a04b8b4c2623b7ac32f462621bf1";
const abi = artifacts.abi
const bytecode = artifacts.bytecode;
const gasPrice = ethers.parseUnits("50", "gwei"); // Priority fee (gas price)
const gasLimit = 3000000; // Gas limit
const baseFee = ethers.parseUnits("20", "gwei"); // Base fee


const providerRPC = {
    elysium: {
        name: 'atlantis',
        rpc: networks.rpc_url,
        chainId: networks.chain_id,
    },
};

const provider = new ethers.JsonRpcProvider(
    providerRPC.elysium.rpc,
    {
        chainId: providerRPC.elysium.chainId,
        name: providerRPC.elysium.name,
    }
);



const wallet = new ethers.Wallet(privateKey, provider);
console.log(wallet);


// Deploy contract function
async function deployContract() {
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    console.log(`Attempting to deploy from account: ${wallet.address}`);
    // Deploy the contract with custom gas options

    const contract = await factory.deploy(wallet.address, {
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        baseFeePerGas: baseFee
    });

    console.log("Contract deploying...");
    const txReceipt = await contract.deploymentTransaction().wait();
    console.log(`Contract deployed at address: ${txReceipt.contractAddress}`);
}

deployContract().catch((err) => console.error(err));
