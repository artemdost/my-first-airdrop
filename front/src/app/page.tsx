"use client";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import type { BrowserProvider } from "ethers";
import type { Dispenser } from "@/typechain";
import ConnectWallet from "./components/ConnectWallet";
import { Dispenser__factory } from "@/typechain";
import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({ weight: "400" });

const HARDHAT_NETWORK_ID = "0x539";
const DISPENSER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

declare let window: any;

type CurrentConnectionProps = {
  provider: BrowserProvider | undefined;
  dispencer: Dispenser | undefined;
  signer: ethers.JsonRpcSigner | undefined;
};

export default function Home() {
  const [networkError, setNetworkError] = useState<string>();
  const [txBeingSent, setTxBeingSent] = useState<string>();
  const [transactionError, setTransactionError] = useState<any>();
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const [currentConnection, setCurrentConnection] =
    useState<CurrentConnectionProps>();

  const _resetState = () => {
    setNetworkError(undefined);
    setCurrentConnection({
      provider: undefined,
      dispencer: undefined,
      signer: undefined,
    });
  };

  const _checkNetwork = async (): Promise<boolean> => {
    const chosenChainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    if (chosenChainId === HARDHAT_NETWORK_ID) {
      return true;
    }

    setNetworkError("Please connect to Polygon network!");

    return false;
  };

  const _initialize = async (selectedAccount: string) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(selectedAccount);

    setCurrentConnection({
      ...currentConnection,
      provider,
      signer,
      dispencer: Dispenser__factory.connect(DISPENSER_ADDRESS, signer),
    });
  };
  const _dismissNetworkError = () => {
    setNetworkError(undefined);
  };

  const _connectWallet = async () => {
    if (window.ethereum === undefined) {
      setNetworkError("Please install Metamask!");

      return;
    }

    if (!(await _checkNetwork())) {
      return;
    }

    const [selectedAccount] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    await _initialize(ethers.getAddress(selectedAccount));

    window.ethereum.on(
      "accountsChanged",
      async ([newAccount]: [newAccount: string]) => {
        if (newAccount === undefined) {
          return _resetState();
        }

        await _initialize(ethers.getAddress(newAccount));
      }
    );

    window.ethereum.on("chainChanged", ([_networkId]: any) => {
      _resetState();
    });
  };

  const _mintTokens = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();

    if (!currentConnection?.dispencer) {
      return false;
    }

    const dispencer = currentConnection.dispencer;
    try {
      const mintTx = await dispencer.mint();

      // setTxBeingSent(mintTx.hash);

      // await mintTx.wait();
    } catch (err) {
      console.error(err);

      setTransactionError(err);
    } finally {
      setTxBeingSent(undefined);
    }
  };

  return (
    <main>
      {!currentConnection?.signer && (
        <ConnectWallet
          connectWallet={_connectWallet}
          networkError={networkError}
          dismiss={_dismissNetworkError}
        />
      )}
      {currentConnection?.signer && (
        <div className="bg-black w-full h-screen m-0 p-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-10">
            <div
              className={`text-white ${pixelify.className} text-4xl animate-fade-in`}
            >
              YOU ARE ELIGIBLE FOR 100 $CRYP!
            </div>
            <button
              className={`text-white ${pixelify.className} px-8 py-4 bg-black border-2 border-white animate-fade-in`}
              onClick={_mintTokens}
            >
              CLAIM TOKENS
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
