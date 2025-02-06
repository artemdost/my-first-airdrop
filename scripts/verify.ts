import hre, { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  await hre.run("verify:verify", {
    address: "0x4a62ab81dcab0fa0d7449bd0a5f789694d9773b7",
    constructorArguments: [
      "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
      "0xb26e9dFAC0B5BC5e0D059B786d351794C29E4457",
    ],
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
