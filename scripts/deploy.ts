import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contract...");

  const [owner] = await ethers.getSigners();

  const CrypERC20 = await ethers.getContractFactory("CrypERC20", owner);
  const crypERC20 = await CrypERC20.deploy();
  await crypERC20.waitForDeployment();

  const Dispenser = await ethers.getContractFactory("Dispenser", owner);
  const dispenser = await Dispenser.deploy(
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    crypERC20.getAddress()
  );
  await dispenser.waitForDeployment();

  console.log("Dispenser deployed to:", await dispenser.getAddress());
  console.log("CrypERC20 deployed to:", await crypERC20.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
