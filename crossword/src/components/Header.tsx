import {
  Button,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
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
  const onClickMetamask = useWalletLogin(setSigner);

  const onClickLogout = () => {
    setSigner(null);
  };
  return (
    <Flex
      alignItems={"center"}
      boxShadow={"0 4px 4px -2px rgba(0, 0, 0, 0.1)"}
      justifyContent={"space-between"}
      h={20}
      px={4}
    >
      <Flex
        w={40}
        fontSize={20}
        onClick={() => navigate("/")}
        fontWeight={"semibold"}
        alignItems={"center"}
      >
        Save the Ocean
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
            textColor={"blue.500"}
          >{`${signer.address.substring(0, 6)}...${signer.address.substring(
            signer.address.length - 4
          )}`}</Button>
        ) : (
          <Button onClick={onClickMetamask} bgColor="transparent">
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
        <Menu>
          <MenuButton
            textColor={"blue.500"}
            borderColor={"blue.400"}
            borderWidth={"3px"}
            bgColor={"white"}
            fontWeight={"semibold"}
            as={Button}
          >
            {signer
              ? `${signer.address.substring(0, 6)}...${signer.address.substring(
                  signer.address.length - 4
                )}`
              : "Menu"}
          </MenuButton>
          <MenuList>
            {!signer && (
              <MenuItem onClick={() => onClickMetamask()}>
                <Image
                  mr={2}
                  src="/images/metamask.svg"
                  alt="METAMASK login"
                  w={6}
                  h={6}
                />{" "}
                METAMASK LOGIN
              </MenuItem>
            )}

            {signer && <MenuItem onClick={onClickLogout}>LOGOUT</MenuItem>}
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Header;
