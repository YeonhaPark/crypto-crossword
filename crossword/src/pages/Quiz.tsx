import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Direction, Puzzle } from "../const";
import wordsJson from "../lib/words.json";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { OutletContext } from "../components/Layout";
import QuizCell from "../components/QuizCell";
import MedalModal from "../components/MedalModal";
import axios from "axios";

const words: Puzzle[] = wordsJson as Puzzle[];

enum Medal {
  PIONEER = 1,
  ADVANCED = 2,
  MASTER = 3,
  AMASSADOR = 4,
}

const Quiz = () => {
  const { signer, mintContract } = useOutletContext<OutletContext>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string>("");
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [revealedPoint, setRevealedPoint] = useState(new Set());
  const [solvedIds, setSolvedIds] = useState(new Set());
  const [medalUri, setMedalUri] = useState<string>("");
  const [wordInfo, setWordInfo] = useState<Puzzle>({
    id: 0,
    level: 1,
    name: "",
    x: 0,
    y: 0,
    direction: "horizontal",
    description: "",
  });

  function checkIfRevealed(cell: Cell) {
    const { x, y } = cell;
    if (revealedPoint.has(`${x}, ${y}`)) {
      return cell.name;
    }
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
    const grid: Cell[][] = Array.from({ length: size }, () =>
      Array(size).fill(null)
    );

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
          .then((tx) => {
            setSolvedIds((prev) => {
              prev.add(wordInfo.id);
              return prev;
            });
            setRevealedPoint((prev) => {
              if (wordInfo.direction === "horizontal") {
                for (let i = 0; i < wordInfo.name.length; i++)
                  prev.add(`${wordInfo.x + i}, ${wordInfo.y}`);
              } else if (wordInfo.direction === "vertical") {
                for (let i = 0; i < wordInfo.name.length; i++) {
                  prev.add(`${wordInfo.x}, ${wordInfo.y + i}`);
                }
              }
              return prev;
            });
            // tx.wait();
            setIsLoading(false);
            setTimeout(() => {
              resolve(200);
            }, 100);
          })
          .catch((error) => {
            console.log(error);
            setIsLoading(false);

            setTimeout(() => {
              setIsError(true);
              reject(error);
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
      await validate;
      setIsLoading(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (medalUri) {
      onOpen();
    }
  }, [medalUri]);
  useEffect(() => {
    if (mintContract) {
      // Define the event listener
      const handleMedalAwarded = (
        user: string,
        level: number,
        medalUri: string
      ) => {
        console.log("Medal awarded:", user, level, medalUri);
        setMedalUri(medalUri);
      };

      // Attach the event listener
      mintContract.on("MedalAwarded", handleMedalAwarded);

      // Clean up the event listener on component unmount
      return () => {
        mintContract.off("MedalAwarded", handleMedalAwarded);
      };
    }
  }, [mintContract]);

  const getQuizStatus = async () => {
    try {
      setIsLoading(true);
      const response = await mintContract.getQuizStatus();
      const set = new Set();
      const solvedQuizList = new Set();
      response.forEach((bool: boolean, index: number) => {
        if (bool) {
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
    getQuizStatus();
  }, [signer, mintContract]);

  const grid = generateGrid(gridSize, words);
  return (
    <Box mx={"auto"} pt={28}>
      <Box mb={20}>
        <Flex justifyContent={"center"} gap={8}>
          {Array.from({ length: 4 }, (_, i) => (
            <Button
              colorScheme={"pink"}
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
          {grid
            .flat()
            .map((cell, index) =>
              cell ? (
                <QuizCell
                  key={index}
                  cell={cell}
                  checkIfRevealed={checkIfRevealed}
                  handleWordClick={handleWordClick}
                />
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
          <Box color="white">
            {wordInfo.description}{" "}
            {solvedIds.has(wordInfo.id) ? (
              <Box mt={2} fontSize={"small"} color={"pink"}>
                You solved this question 🙌🏼
              </Box>
            ) : (
              ""
            )}
          </Box>
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
      <MedalModal
        onClose={onClose}
        metadataUri={medalUri}
        name={Medal[currentLevel]}
        isOpen={isOpen}
      />
    </Box>
  );
};

export default Quiz;
