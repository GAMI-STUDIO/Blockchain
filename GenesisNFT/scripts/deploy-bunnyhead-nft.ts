import { ethers } from "hardhat";

async function main() {
  // const gasPrice = ethers.parseUnits("50", "gwei"); // Priority fee (gas price)
  // const gasLimit = 6000000; // Gas limit

  // Check the balance of the deployer account
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} ETH`);

  // 1. Get the contract to deploy
  const BunnyHeadNFT = await ethers.getContractFactory('GenesisNFT');
  console.log('Deploying GenesisNFT...');

  // 2. Instantiating a new GenesisNFT smart contract 
  // const initialOwner = "0x64c4ee11140C2880e0c85053104b5F2229342880"; // dev address
  const initialOwner = "0x4c43A30AD27421FF27Ed12d4305211Ae1F811C94"; // live address
  const initialBaseURI = "https://red-glamorous-weasel-983.mypinata.cloud/ipfs/QmcYf1UbpdhBvyQscDsQHZW8kTt86T7jzuJL5GDUG1BfMy/";
  const initialName = "BunnyHeadNFT"; 
  
  console.log(`Initial owner: ${initialOwner}`);
  console.log(`Initial base URI: ${initialBaseURI}`);

  try {
    const bunnyHeadNFT = await BunnyHeadNFT.deploy(initialOwner, initialName, initialBaseURI);

    // 3. Waiting for the deployment to resolve
    await bunnyHeadNFT.waitForDeployment();

    // 4. Use the contract instance to get the contract address
    console.log('Bunny Head NFT deployed to:', bunnyHeadNFT.target);

    // 5. Mint 18 NFTs, each with 20,000 copies
    console.log('Minting 3 NFTs with 20,000 copies each...');
    const tokenIds = Array.from({ length: 3 }, (_, i) => i + 1); // [1, 2, ..., 3]
    const amounts = Array(3).fill(20000); // [20000, 20000, ..., 20000]

    const mintBatchTx = await bunnyHeadNFT.mintBatch(initialOwner, tokenIds, amounts, "0x");
    await mintBatchTx.wait();


    console.log('Successfully minted 3 NFTs with 20,000 copies each');
  } catch (error) {
    console.error("Deployment failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
