import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import words, { Puzzle } from "../const";
const Quiz = () => {
  const generateGrid = (size: number, words: Puzzle[]) => {
    // Create a 16x16 grid filled with null
    const grid = Array.from({ length: size }, () => Array(size).fill(null));

    words.forEach(({ name, x, y, direction }) => {
      for (let i = 0; i < name.length; i++) {
        if (direction === "horizontal") {
          grid[y][x + i] = name[i];
        } else if (direction === "vertical") {
          grid[y + i][x] = name[i];
        }
      }
    });

    return grid;
  };

  const gridSize = 16;
  const grid = generateGrid(gridSize, words);

  const handleClick = () => {};
  return (
    <Box mx={"auto"} width={560} pt={28}>
      <Box mb={20}>
        <Flex justifyContent={"center"} gap={8}>
          <Button>Level 1</Button>
          <Button>Level 2</Button>
          <Button>Level 3</Button>
          <Button>Level 4</Button>
        </Flex>
      </Box>
      <Flex justifyContent="center">
        <Grid gridTemplateColumns={"repeat(16, 1fr)"} gap={0}>
          {grid.flat().map((cell, index) => (
            <GridItem
              key={index}
              bgColor={cell ? "white" : "black"}
              w={8}
              h={8}
              borderWidth={1}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              borderColor={"gray.700"}
            >
              {cell}
            </GridItem>
          ))}
        </Grid>
      </Flex>
      <Box w={512} mt={6} mx={"auto"}>
        <label htmlFor="">
          <Text color="white">
            A digital asset that represents ownership or a stake in a project,
            often used in blockchain networks.
          </Text>
        </label>
        <InputGroup mt={4}>
          <Input
            placeholder="Write your answer here"
            color={"crypto"}
            borderColor={"purple"}
            borderWidth={2}
            mx={"auto"}
          />
          <InputRightElement right={2} width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              Submit
            </Button>
          </InputRightElement>
        </InputGroup>
      </Box>
      <Box height={200} w={"100%"}></Box>
    </Box>
  );
};

export default Quiz;
