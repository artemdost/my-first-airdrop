import { loadFixture, ethers, expect } from "./setup";
import { Dispenser, Dispenser__factory, CrypERC20 } from "../typechain-types";
import { BaseContract, ContractTransactionReceipt } from "ethers";

describe("Dispenser", function () {
  async function deploy() {
    const [owner, buyer] = await ethers.getSigners();

    const CrypERC20 = await ethers.getContractFactory("CrypERC20");
    const crypERC20 = await CrypERC20.deploy();

    const Dispenser = await ethers.getContractFactory("Dispenser");

    const dispenser = await Dispenser.deploy(
      crypERC20.getAddress(),
      crypERC20.getAddress()
    );

    await dispenser.waitForDeployment();

    return { tracker, owner, buyer };
  }
});
