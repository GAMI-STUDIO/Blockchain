// scripts/deploy.js
const { ethers } = require("");
async function main() {
  const gasPrice = ethers.parseUnits("50", "gwei"); // Priority fee (gas price)
  const gasLimit = 3000000; // Gas limit
  const baseFee = ethers.parseUnits("20", "gwei"); // Base fee
  // 1. Get the contract to deploy
  const Box = await ethers.getContractFactory('NFT');
  console.log('Deploying Box...');

  // 2. Instantiating a new Box smart contract
  const box = await Box.deploy({
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    baseFeePerGas: baseFee
  });

  // 3. Waiting for the deployment to resolve
  await box.deployed();

  // 4. Use the contract instance to get the contract address
  console.log('Box deployed to:', box.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });



// import { ethers, upgrades } from "hardhat";

// async function main() {
//   const [deployer] = await ethers.getSigners();
//   const contractInstance = await ethers.getContractFactory("NFT");
//   const contract = await upgrades.deployProxy(contractInstance, [deployer.address]);
//   await contract.waitForDeployment();
//   console.log("Contract deployed to:", await contract.getAddress());
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
