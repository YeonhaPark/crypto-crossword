import { Box } from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { JsonRpcSigner } from "ethers";
import { Contract } from "ethers";
import { mintContractAddress } from "../lib/mintContractAddress";
import mintContractAbi from "../lib/mintContractAbi.json";
import Header from "./Header";

export interface OutletContext {
  mintContract: Contract;
  signer: JsonRpcSigner | null;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
}
const Layout: FC = () => {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  const [mintContract, setMintContract] = useState<Contract | null>(null);

  useEffect(() => {
    if (!signer) return;
    setMintContract(new Contract(mintContractAddress, mintContractAbi, signer));
  }, [signer]);

  return (
    <Box minH={"100vh"} bgColor={"#000000"}>
      <Header signer={signer} setSigner={setSigner} />
      <Box maxW={1024} marginX={"auto"}>
        <Outlet context={{ signer, mintContract, setSigner }} />
      </Box>
    </Box>
  );
};

export default Layout;
