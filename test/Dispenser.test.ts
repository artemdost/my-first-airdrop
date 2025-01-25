import { loadFixture, ethers, expect } from "./setup";
import {
  Dispenser,
  Dispenser__factory,
  CrypERC20,
  USDT,
} from "../typechain-types";
import { BaseContract, ContractTransactionReceipt } from "ethers";

describe("Dispenser", function () {
  async function deploy() {
    const [owner, buyer] = await ethers.getSigners();

    const CrypERC20 = await ethers.getContractFactory("CrypERC20");
    const crypERC20 = await CrypERC20.deploy();
    await crypERC20.waitForDeployment();

    const USDT = await ethers.getContractFactory("USDT");
    const usdt = await USDT.deploy();
    await usdt.waitForDeployment();

    const Dispenser = await ethers.getContractFactory("Dispenser");
    const dispenser = await Dispenser.deploy(
      usdt.getAddress(),
      crypERC20.getAddress()
    );
    await dispenser.waitForDeployment();

    await crypERC20.transfer(
      dispenser.getAddress(),
      BigInt((await crypERC20.balanceOf(owner)).toString())
    );

    return { dispenser, usdt, crypERC20, owner, buyer };
  }

  it("checks for start balance", async function () {
    const { dispenser, usdt, crypERC20, owner, buyer } = await loadFixture(
      deploy
    );
    await usdt.transfer(
      dispenser.getAddress(),
      BigInt((await usdt.balanceOf(owner)).toString())
    );

    expect(await usdt.balanceOf(owner)).to.be.eq(0);
    expect(await crypERC20.balanceOf(owner)).to.be.eq(0);
    expect(await usdt.balanceOf(dispenser.getAddress())).to.be.eq(
      100000n * 10n ** 6n
    );
    expect(await crypERC20.balanceOf(dispenser.getAddress())).to.be.eq(
      100000n * 10n ** 18n
    );
  });

  it("takes tokens", async function () {
    const { dispenser, usdt, crypERC20, owner, buyer } = await loadFixture(
      deploy
    );
    await usdt.transfer(
      dispenser.getAddress(),
      BigInt((await usdt.balanceOf(owner)).toString())
    );

    const buyTx = await dispenser.connect(buyer).mint();

    await expect(buyTx).to.changeTokenBalances(
      usdt,
      [buyer, dispenser],
      [1n * 10n ** 6n, -1n * 10n ** 6n]
    );

    await expect(buyTx).to.changeTokenBalances(
      crypERC20,
      [buyer, dispenser],
      [100n * 10n ** 18n, -100n * 10n ** 18n]
    );
  });

  it("reverts if someone takes it twice", async function () {
    const { dispenser, usdt, crypERC20, owner, buyer } = await loadFixture(
      deploy
    );

    await usdt.transfer(
      dispenser.getAddress(),
      BigInt((await usdt.balanceOf(owner)).toString())
    );

    await dispenser.connect(buyer).mint();
    expect(dispenser.connect(buyer).mint()).to.be.revertedWith(
      "You already received your drop"
    );
  });

  it("sends only CRYP if usdt pool is lower then 1 usdt", async function () {
    const { dispenser, usdt, crypERC20, owner, buyer } = await loadFixture(
      deploy
    );
    const buyTX = await dispenser.connect(buyer).mint();

    expect(buyTX).to.be.changeTokenBalances(usdt, [buyer, dispenser], [0n, 0n]);
    expect(buyTX).to.be.changeTokenBalances(
      crypERC20,
      [buyer, dispenser],
      [100n * 10n ** 18n, -100n * 10n ** 18n]
    );
  });
});
