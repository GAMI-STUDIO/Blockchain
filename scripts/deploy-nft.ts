import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const contractInstance = await ethers.getContractFactory("NFT");
  const contract = await upgrades.deployProxy(contractInstance, [deployer.address]);
  await contract.waitForDeployment();
  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
