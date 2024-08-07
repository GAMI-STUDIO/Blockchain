import { ethers } from "hardhat";

async function main() {
  const gasPrice = ethers.parseUnits("50", "gwei"); // Priority fee (gas price)
  const gasLimit = 6000000; // Gas limit

  // Check the balance of the deployer account
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} ETH`);

  // 1. Get the contract to deploy
  const GenesisNFT = await ethers.getContractFactory('GenesisNFT');
  console.log('Deploying GenesisNFT...');

  // 2. Instantiating a new GenesisNFT smart contract
  const initialOwner = "0x64c4ee11140C2880e0c85053104b5F2229342880"; // Replace with actual owner address
  const initialBaseURI = "https://red-glamorous-weasel-983.mypinata.cloud/ipfs/QmTCC4dw2XfJazZvaZDfLBpoAgj2wShoVz46y35iX5tRuU/{id}.json";

  console.log(`Initial owner: ${initialOwner}`);
  console.log(`Initial base URI: ${initialBaseURI}`);

  try {
    const genesisNFT = await GenesisNFT.deploy(initialOwner, initialBaseURI, {
      gasPrice: gasPrice,
      gasLimit: gasLimit
    });

    // 3. Waiting for the deployment to resolve
    await genesisNFT.waitForDeployment();

    // 4. Use the contract instance to get the contract address
    console.log('GenesisNFT deployed to:', genesisNFT.target);

    // 5. Mint 18 NFTs, each with 1,000 copies
    console.log('Minting 18 NFTs with 1,000 copies each...');
    const tokenIds = Array.from({ length: 18 }, (_, i) => i + 1); // [1, 2, ..., 18]
    const amounts = Array(18).fill(1000); // [1000, 1000, ..., 1000]

    const mintBatchTx = await genesisNFT.mintBatch(initialOwner, tokenIds, amounts, "0x");
    await mintBatchTx.wait();


    console.log('Successfully minted 18 NFTs with 1,000 copies each');
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
