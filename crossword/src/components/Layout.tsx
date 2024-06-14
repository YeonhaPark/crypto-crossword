import { Box, Flex } from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { JsonRpcSigner } from "ethers";
import { Contract } from "ethers";
// import { mintContractAddress } from "../lib/contractAddress";
// import mintContractAbi from "../lib/mintContractAbi.json";

export interface OutletContext {
  mintContract: Contract;
  signer: JsonRpcSigner | null;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
}
const Layout: FC = () => {
  //   const [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  //   const [mintContract, setMintContract] = useState<Contract | null>(null);

  //   useEffect(() => {
  //     if (!signer) return;
  //     setMintContract(new Contract(mintContractAddress, mintContractAbi, signer));
  //   }, [signer]);

  return (
    <Box minH={"100vh"} bgColor={"#000000"}>
      <Box maxW={1024} marginX={"auto"}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
