import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contract...");

  const [deployer] = await ethers.getSigners();

  const CrypERC20 = await ethers.getContractFactory("CrypERC20", deployer);
  const crypERC20 = await CrypERC20.deploy();

  await crypERC20.waitForDeployment();

  console.log(`Deployed to ${await crypERC20.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
