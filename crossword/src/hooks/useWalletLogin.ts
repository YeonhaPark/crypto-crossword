import { JsonRpcSigner } from "ethers";
import { ethers } from "ethers";
import { Dispatch, SetStateAction } from "react";

const useWalletLogin = (
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>
) => {
  const login = async () => {
    try {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      setSigner(await provider.getSigner());
    } catch (e) {
      console.error(e);
    }
  };
  return login;
};

export default useWalletLogin;
