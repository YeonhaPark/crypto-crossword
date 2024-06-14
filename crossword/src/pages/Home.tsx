import { Box, Button, Image } from "@chakra-ui/react";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

const Home: FC = () => {
  const navigate = useNavigate();
  return (
    <Box
      textAlign={"center"}
      pt={28}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Image
        src="/images/crypto-cross.gif"
        alt="crypto-cross"
        mx={"auto"}
        w={360}
        h={360}
      />
      <Box textColor={"white"} mt={16}>
        Test your Web 3.0 knowledge by solving the crossword puzzle!
      </Box>
      <Box textColor={"white"}>
        Each time you complete one level you will be given our cool NFT Badge!
        🥳🏆
      </Box>
      <Button
        mt={20}
        onClick={() => navigate("/quiz")}
        textColor={"crypto"}
        colorScheme={"purple"}
        bgColor={"purple"}
        fontWeight={"bold"}
        fontSize={32}
        textShadow={"-1px 0 black, 0 1px black, 1px 0 black"}
        size={"lg"}
      >
        START
      </Button>
    </Box>
  );
};

export default Home;
