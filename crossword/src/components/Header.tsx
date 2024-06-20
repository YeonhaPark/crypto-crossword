import { Button, Flex, Image, Text } from "@chakra-ui/react";
import { Dispatch, FC, SetStateAction } from "react";

import { JsonRpcSigner } from "ethers";
import { useNavigate } from "react-router-dom";
import useWalletLogin from "../hooks/useWalletLogin";

interface HeaderProps {
  signer: JsonRpcSigner | null;
  setSigner: Dispatch<SetStateAction<JsonRpcSigner | null>>;
}

const Header: FC<HeaderProps> = ({ signer, setSigner }) => {
  const navigate = useNavigate();
  const [onClickMetamask, onClickLogout] = useWalletLogin(setSigner);

  return (
    <Flex
      alignItems={"center"}
      pt={8}
      boxShadow={"0 4px 4px -2px rgba(0, 0, 0, 0.1)"}
      justifyContent={"space-between"}
      h={20}
      px={14}
    >
      <Flex
        w={40}
        fontSize={[20, 24, 24]}
        onClick={() => navigate("/")}
        fontWeight={"semibold"}
        alignItems={"center"}
        color={"white"}
        className="bungee-regular"
      >
        CRYPTO CROSS
      </Flex>

      <Flex
        display={["none", "none", "flex"]}
        w={40}
        alignItems={"center"}
        justifyContent={"end"}
      >
        {signer ? (
          <Button
            onClick={onClickLogout}
            bgColor="crypto"
            textColor={"white"}
            colorScheme="white"
          >{`${signer.address.substring(0, 6)}...${signer.address.substring(
            signer.address.length - 4
          )}`}</Button>
        ) : (
          <Button
            onClick={onClickMetamask}
            textColor={"crypto"}
            borderColor={"crypto"}
            borderWidth={"3px"}
            bgColor={"white"}
            className="bungee-regular"
            fontSize={[18, 20, 20]}
          >
            <Image
              src="/images/metamask.svg"
              alt="Metamask Login"
              w={10}
              mr={2}
              h={10}
            />
            LOGIN
          </Button>
        )}
      </Flex>
      <Flex display={["flex", "flex", "none"]}>
        <Button
          textColor={"crypto"}
          borderColor={"crypto"}
          borderWidth={"3px"}
          bgColor={"white"}
          fontWeight={"semibold"}
          as={Button}
          className="bungee-regular"
        >
          {signer ? (
            <Text fontSize={[14, 14, 18]}>
              `${signer.address.substring(0, 6)}...$
              {signer.address.substring(signer.address.length - 4)}`
            </Text>
          ) : (
            <>
              <Image
                mr={2}
                src="/images/metamask.svg"
                alt="METAMASK login"
                w={6}
                h={6}
              />
              LOGIN
            </>
          )}
        </Button>
      </Flex>
    </Flex>
  );
};

export default Header;
