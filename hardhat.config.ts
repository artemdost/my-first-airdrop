import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 1337,
      initialBaseFeePerGas: 0,
    },
    arbitrum_sepolia: {
      url: `${process.env.ALCHEMY_ARB_SEPOLIA_URL}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
    },
  },
};

export default config;
