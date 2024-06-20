import { JsonRpcSigner } from "ethers";
import { Contract } from "ethers";
import { ethers } from "ethers";
import { Dispatch, SetStateAction, useEffect } from "react";

const useWalletLogin = (
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>,
  setMintContract: Dispatch<SetStateAction<Contract | null>>
) => {
  const getSigner = async () => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);

      setSigner(await provider.getSigner());
    } catch (e) {
      console.error(e);
    }
  };
  const onClickMetamask = async () => {
    try {
      getSigner();
      localStorage.setItem("isLoggedIn", "true");
    } catch (e) {
      console.error(e);
    }
  };
  const onClickLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setSigner(null);
    setMintContract(null);
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      getSigner();
    }
  }, []);
  return [onClickMetamask, onClickLogout];
};

export default useWalletLogin;
