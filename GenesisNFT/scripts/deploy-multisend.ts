import { ethers } from "hardhat";

async function main() {

  // Check the balance of the deployer account
  const [deployer] = await ethers.getSigners();
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`Deployer balance: ${ethers.formatEther(balance)} ETH`);

  // 1. Get the contract to deploy
  const MultiSendContract = await ethers.getContractFactory('MultiSend');
  console.log('Deploying MultiSendContract...');

  // 2. Instantiating a new smart contract 
  // const initialOwner = "0x64c4ee11140C2880e0c85053104b5F2229342880"; // dev address
  const initialOwner = "0x4c43A30AD27421FF27Ed12d4305211Ae1F811C94"; // live address
  
  try {
    const multiSendContract = await MultiSendContract.deploy();

    // 3. Waiting for the deployment to resolve
    await multiSendContract.waitForDeployment();

    // 4. Use the contract instance to get the contract address
    console.log('MultiSend Contract deployed to:', multiSendContract.target);

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
