const { ethers } = require('ethers');
const artifacts = require("./artifacts/contracts/nft/erc1155.sol/NFT.json");

const privateKey = "a14c8c147e9e0ef4b642a2884fd604eea117a04b8b4c2623b7ac32f462621bf1";
//const privateKey = '4a9795d6d7fcde5ded1221fbd8f9c8a6ab8fa8bba5b1e153d9f087eff7046a1b'
const networks = {
    rpc_url: "https://rpc.atlantischain.network",
    chain_id: 1338
}

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
const contractAddress = '0x66Ea24a0BbeCe9e8978FbaeD12e493Ca5f53f9CC';
const nft = new ethers.Contract(contractAddress, artifacts.abi, wallet);

const mint = async (recipientAddress, tokenId, amount, data, gasPrice, gasLimit) => {
    try {
        const mintSingle = await nft.mint(recipientAddress, tokenId, amount, data, {
            gasPrice: ethers.parseUnits(gasPrice, "gwei"),
            gasLimit: gasLimit
        });
        await mintSingle.wait();
        console.log(`Minted token ID ${tokenId} with amount ${amount} to ${recipientAddress}`);
        console.log(mintSingle);
    } catch (error) {
        console.error('Error in mint:', error);
    }
};

const mintBatch = async (recipientAddress, tokenIds, amounts, data, gasPrice, gasLimit) => {
    try {
        const mintBatchReceipt = await nft.mintBatch(recipientAddress, tokenIds, amounts, data, {
            gasPrice: ethers.parseUnits(gasPrice, "gwei"),
            gasLimit: gasLimit
        });
        await mintBatchReceipt.wait();
        console.log(`Minted batch of token IDs ${tokenIds} with amounts ${amounts} to ${recipientAddress}`);
        console.log(mintBatchReceipt);
    } catch (error) {
        console.error('Error in mintBatch:', error);
    }
};

const transferBatch = async (from, recipientAddress, tokenIds, amounts, data, gasPrice, gasLimit) => {
    try {
        const transferBatchReceipt = await nft.safeBatchTransferFrom(from, recipientAddress, tokenIds, amounts, data, {
            gasPrice: ethers.parseUnits(gasPrice, "gwei"),
            gasLimit: gasLimit
        });
        await transferBatchReceipt.wait();
        console.log(`Transferred batch of token IDs ${tokenIds} with amounts ${amounts} from ${from} to ${recipientAddress}`);
        console.log(transferBatchReceipt);
    } catch (error) {
        console.error('Error in transferBatch:', error);
    }
};
const main = async () => {
    const recipientAddress = '0x2BC819b67Afd66DfFC93af41986d480C9c808020';
    const tokenId = 16;
    const amount = 5;
    const data = '0x';
    const gasPrice = "50"; // Priority fee (gas price in gwei)
    const gasLimit = 3000000;

    await mint(recipientAddress, tokenId, amount, data, gasPrice, gasLimit);

    // const tokenIds = [12, 13, 14, 15];
    // const amounts = [2, 3, 4, 5];
    //await mintBatch(recipientAddress, tokenIds, amounts, data, gasPrice, gasLimit);

    // const from = '0x1C5a08B5bD707Eb9C35773C79d35272965bA1161';
    // await transferBatch(from, recipientAddress, tokenIds, amounts, data, gasPrice, gasLimit);
}

main().catch((err) => console.error(err));
