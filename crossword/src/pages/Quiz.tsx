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
  useToast,
} from "@chakra-ui/react";
import { Direction, Puzzle } from "../const";
import wordsJson from "../lib/words.json";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";

const words: Puzzle[] = wordsJson as Puzzle[];

const Quiz = () => {
  const { signer, mintContract } = useOutletContext<OutletContext>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [revealedPoint, setRevealedPoint] = useState(new Set());
  const [solvedIds, setSolvedIds] = useState(new Set());
  const [wordInfo, setWordInfo] = useState<Puzzle>({
    id: 0,
    level: 1,
    name: "",
    x: 0,
    y: 0,
    direction: "horizontal",
    description: "",
  });

  // bool[] quizStatus revealed: DAPP [[2, 6], [2,7], [2,8], [2,9]]

  function checkIfRevealed(cell: Cell) {
    const { x, y } = cell;
    if (revealedPoint.has(`${x}, ${y}`)) return cell.name;
  }

  interface Cell {
    index: number;
    name: string;
    direction: Direction;
    id: number;
    x: number;
    y: number;
  }
  const generateGrid = (size: number, words: Puzzle[]) => {
    const grid = Array.from({ length: size }, () => Array(size).fill(null));

    words.forEach(({ id, name, x, y, direction }) => {
      for (let i = 0; i < name.length; i++) {
        if (direction === "horizontal") {
          grid[y][x + i] = {
            index: i,
            name: name[i],
            direction,
            id,
            x: x + i,
            y,
          };
        } else if (direction === "vertical") {
          grid[y + i][x] = {
            index: i,
            name: name[i],
            direction,
            id,
            x,
            y: y + i,
          };
        }
      }
    });
    return grid;
  };

  const gridSize = 16;

  const grid = generateGrid(gridSize, words);

  const handleWordClick = (id: number) => {
    const found = words.find((word) => word.id === id);
    if (found) {
      setWordInfo(found);
      setAnswer("");
    }
  };
  const toast = useToast();

  const handleSubmit = async () => {
    try {
      if (solvedIds.has(wordInfo.id)) {
        return;
      }

      const validate = new Promise((resolve, reject) => {
        const upperCasedAnswer = answer.toUpperCase();
        setIsLoading(true);
        mintContract
          .solveQuestion(wordInfo.id, upperCasedAnswer, currentLevel)
          .then((value) => {
            setIsLoading(false);
            setTimeout(() => {
              getQuizStatus();

              resolve(200);
            }, 5000);
            console.log({ value });
          })
          .catch((error) => {
            console.log(error);
            setIsLoading(false);

            setTimeout(() => {
              setIsError(true);
              reject(200);
            }, 4000);
          });
      });

      toast.promise(validate, {
        success: { title: "Yay!", description: "Well Done!" },
        error: {
          title: "Wrong",
          description: "Oops! Try another answer",
        },
        loading: { title: "Checking...", description: "Please wait" },
      });

      setIsLoading(true);
      wordInfo.id;
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  // only admin
  // const generateQuiz = async () => {
  //   try {
  //     await mintContract.generateQuiz(
  //       words.map((word) => [word.name, word.name, word.id])
  //     );
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  const getQuizStatus = async () => {
    try {
      setIsLoading(true);
      const response = await mintContract.getQuizStatus();
      const set = new Set();
      const solvedQuizList = new Set();
      response.forEach((bool: boolean, index: number) => {
        if (bool) {
          // 좌표 찍기
          const id = currentLevel * 0 + index + 1;
          solvedQuizList.add(id);
          const word = words.find((w) => w.id === id);
          if (word) {
            if (word.direction === "horizontal") {
              for (let i = 0; i < word.name.length; i++)
                set.add(`${word.x + i}, ${word.y}`);
            } else if (word.direction === "vertical") {
              for (let i = 0; i < word.name.length; i++) {
                set.add(`${word.x}, ${word.y + i}`);
              }
            }
          }
        }
      });
      setSolvedIds(solvedQuizList);
      setRevealedPoint(set);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!signer || !mintContract) return;
    // generateQuiz();
    getQuizStatus();
  }, [signer, mintContract]);
  return (
    <Box mx={"auto"} pt={28}>
      <Box mb={20}>
        <Flex justifyContent={"center"} gap={8}>
          {Array.from({ length: 4 }, (_, i) => (
            <Button
              key={i}
              isDisabled={currentLevel < i + 1}
              onClick={() => setCurrentLevel(i + 1)}
            >
              Level {i + 1}
            </Button>
          ))}
        </Flex>
      </Box>
      <Flex justifyContent="center">
        <Grid gridTemplateColumns={"repeat(16, 1fr)"} gap={0}>
          {grid.flat().map((cell, index) =>
            cell ? (
              <GridItem
                key={index}
                bgColor={"white"}
                datatype={cell.id}
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
                    w={3}
                    h={3}
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
            ) : (
              <GridItem
                key={index}
                bgColor={"black"}
                w={10}
                h={10}
                borderWidth={1}
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                borderColor={"gray.700"}
              ></GridItem>
            )
          )}
        </Grid>
      </Flex>
      <Box mt={6} mx={"auto"} w={"576px"}>
        <label htmlFor="">
          <Text color="white">
            {wordInfo.description}{" "}
            {solvedIds.has(wordInfo.id) ? (
              <Box mt={2} fontSize={"small"} color={"red"}>
                You already solved this question 🙌🏼
              </Box>
            ) : (
              ""
            )}
          </Text>
        </label>
        <InputGroup mt={4}>
          <Input
            placeholder="Write your answer here"
            color={"crypto"}
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            borderColor={isError ? "red.500" : "purple"}
            borderWidth={2}
            mx={"auto"}
          />
          <InputRightElement right={2} width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={handleSubmit}
              isLoading={isLoading}
              isDisabled={!answer || solvedIds.has(wordInfo.id)}
            >
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
