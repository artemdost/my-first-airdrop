import { ethers } from "hardhat";

async function main() {
  console.log("Deploying contract...");

  const [owner] = await ethers.getSigners();

  const CrypERC20 = await ethers.getContractFactory("CrypERC20", owner);
  const crypERC20 = await CrypERC20.deploy();
  await crypERC20.waitForDeployment();

  const USDT = await ethers.getContractFactory("USDT", owner);
  const usdt = await USDT.deploy();
  await usdt.waitForDeployment();

  const Dispenser = await ethers.getContractFactory("Dispenser", owner);
  const dispenser = await Dispenser.deploy(
    usdt.getAddress(),
    crypERC20.getAddress()
  );
  await dispenser.waitForDeployment();

  console.log("Dispenser deployed to:", await dispenser.getAddress());
  console.log("CrypERC20 deployed to:", await crypERC20.getAddress());
  console.log("USDT deployed to:", await usdt.getAddress());
  console.log("Balance USDT: ", await usdt.balanceOf(owner.getAddress()));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
