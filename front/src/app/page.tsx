"use client";
import { useState } from "react";
import { ethers } from "ethers";
import type { BrowserProvider } from "ethers";
import type { Dispenser } from "@/typechain";
import ConnectWallet from "./components/ConnectWallet";
import { Dispenser__factory } from "@/typechain";
import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({
  subsets: ["latin"], // Укажите одно или несколько подмножеств
  preload: true, // Предзагрузка шрифта
});

const HARDHAT_NETWORK_ID = "0x539";
const DISPENSER_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

declare let window: Window & { ethereum?: any };

type CurrentConnectionProps = {
  provider: BrowserProvider | undefined;
  dispencer: Dispenser | undefined;
  signer: ethers.JsonRpcSigner | undefined;
};

export default function Home() {
  const [networkError, setNetworkError] = useState<string>();
  const [txBeingSent, setTxBeingSent] = useState<string>();
  const [isClaimed, setIsClaimed] = useState<boolean>(false);
  const [currentConnection, setCurrentConnection] =
    useState<CurrentConnectionProps>();
  const [sucess, setSucess] = useState<boolean>(false);

  const _resetState = () => {
    setNetworkError(undefined);
    setCurrentConnection({
      provider: undefined,
      dispencer: undefined,
      signer: undefined,
    });
    setIsClaimed(false);
    setSucess(false);
    setTxBeingSent("");
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

    const dispencer = Dispenser__factory.connect(DISPENSER_ADDRESS, provider);

    const claim = await dispencer.received(signer.address);
    setIsClaimed(claim);
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

    window.ethereum.on("chainChanged", ([_networkId]: string[]) => {
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
      // Отправляем транзакцию
      const mintTx = await dispencer.mint();
      setTxBeingSent(mintTx.hash); // Устанавливаем хеш сразу после отправки
      await mintTx.wait(); // Ждём подтверждения транзакции

      setSucess(true); // Устанавливаем статус успешного выполнения
    } catch (err) {
      console.error(err);
    }
  };
  console.log("Sucess:", sucess);
  console.log("TX:", txBeingSent);
  return (
    <main>
      {!currentConnection?.signer && (
        <ConnectWallet
          connectWallet={_connectWallet}
          networkError={networkError}
          dismiss={_dismissNetworkError}
        />
      )}

      {isClaimed === true && sucess === false && (
        <div className="bg-black w-full h-screen m-0 p-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-10">
            <div
              className={`text-white ${pixelify.className} text-4xl animate-fade-in`}
            >
              YOU ALREADY RECEIVED YOUR TOKENS
            </div>
            <button
              className={`text-white ${pixelify.className} px-8 py-4 bg-black border-2 border-white animate-fade-in`}
              onClick={_resetState}
            >
              DISCONNECT
            </button>
          </div>
        </div>
      )}

      {currentConnection?.signer && isClaimed === false && sucess === false && (
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

      {currentConnection?.signer && sucess === true && (
        <div className="bg-black w-full h-screen m-0 p-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-10">
            <div
              className={`text-white ${pixelify.className} text-4xl animate-fade-in flex flex-col items-center`}
            >
              <div className="mb-2">SUCCESSFULLY CLAIMED AT TX:</div>
              <div>{txBeingSent}</div>
            </div>
            <button
              className={`text-white ${pixelify.className} px-8 py-4 bg-black border-2 border-white animate-fade-in`}
              onClick={_resetState}
            >
              DISCONNECT
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
