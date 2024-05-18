const { ethers } = require('ethers');
const artifacts = require("./artifacts/contracts/nft/erc1155.sol/NFT.json");


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

const contractAddress = '0x66Ea24a0BbeCe9e8978FbaeD12e493Ca5f53f9CC';

const nft = new ethers.Contract(contractAddress, artifacts.abi, provider);

const main = async () => {
    console.log(`Making call to contract ${contractAddress}`);

    const owner = await nft.owner();
    console.log(`Owner of the contract ${owner}`);

    const paused = await nft.paused();
    console.log(`Paused status of contract set to ${paused}`)

    const totalSupply = await nft.totalSupply();
    console.log(`Total supply of nft is ${totalSupply}`);

    // const totalSupplyOfId = await nft.totalSupply(uint256=8);
    // console.log(`Total supply of nft id 8 is ${totalSupplyOfId}`);

    const balance = await nft.balanceOf('0x1eDE0F99Fcd25d2a3f8Cc707d71eFE895a5Db9dB', '8');
    console.log(balance);
}

main().catch((err) => console.error(err));
