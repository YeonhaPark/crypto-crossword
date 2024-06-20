import { Direction } from "../const";
import { Flex, GridItem, Text } from "@chakra-ui/react";
interface Cell {
  index: number;
  name: string;
  direction: Direction;
  id: number;
  x: number;
  y: number;
}
const QuizCell = ({
  cell,
  handleWordClick,
  checkIfRevealed,
}: {
  cell: Cell;
  handleWordClick: (id: number) => void;
  checkIfRevealed: (cell: Cell) => string | undefined;
}) => {
  return (
    <GridItem
      bgColor={"white"}
      w={10}
      h={10}
      borderWidth={1}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      borderColor={"gray.700"}
      pos={"relative"}
    >
      {cell.index === 0 && (
        <Flex
          pos={"absolute"}
          top={1}
          left={1}
          fontSize={10}
          textColor={"white"}
          bgColor={"crypto"}
          w={4}
          h={4}
          justifyContent={"center"}
          alignItems={"center"}
          rounded={"full"}
          cursor={"pointer"}
          onClick={() => {
            handleWordClick(cell.id);
          }}
        >
          {cell.id}
        </Flex>
      )}
      <Text pos={"relative"}>{checkIfRevealed(cell)}</Text>
    </GridItem>
  );
};

export default QuizCell;
