import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  const EntryPointAddress = '';
  const contractInstance = await ethers.getContractFactory("WalletFactory");
  const contract = await upgrades.deployProxy(contractInstance, [EntryPointAddress, deployer.address]);
  await contract.waitForDeployment();
  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
