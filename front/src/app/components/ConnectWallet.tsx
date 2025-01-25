import React from "react";
import NetworkErrorMessage from "./NetworkErrorMessage";
import { Pixelify_Sans } from "next/font/google";

const pixelify = Pixelify_Sans({ weight: "400" });

type ConnectWalletProps = {
  connectWallet: React.MouseEventHandler<HTMLButtonElement>;
  dismiss: React.MouseEventHandler<HTMLButtonElement>;
  networkError: string | undefined;
};

const ConnectWallet: React.FunctionComponent<ConnectWalletProps> = ({
  connectWallet,
  networkError,
  dismiss,
}) => {
  return (
    <>
      <div>
        {networkError && (
          <NetworkErrorMessage message={networkError} dismiss={dismiss} />
        )}
      </div>
      <div className="bg-black w-full h-screen m-0 p-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-10">
          <div className={`text-white ${pixelify.className} text-4xl`}>
            AIRDROP $CRYP CHECKER
          </div>
          <button
            className={`text-white ${pixelify.className} px-8 py-4 bg-black border-2 border-white`}
            onClick={connectWallet}
          >
            Connect wallet
          </button>
        </div>
      </div>
    </>
  );
};

export default ConnectWallet;
