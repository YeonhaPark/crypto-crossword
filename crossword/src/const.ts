export type Direction = "vertical" | "horizontal";
export interface Puzzle {
  id: number;
  level: number;
  name: string;
  x: number;
  y: number;
  direction: Direction;
  description: string;
}

const words: Puzzle[] = [
  {
    id: 1,
    level: 1,
    name: "tokenization",
    x: 10,
    y: 0,
    direction: "vertical",
    description:
      "The process of converting rights to an asset into a digital token on a blockchain.",
  },
  {
    id: 2,
    level: 1,

    name: "mining",
    x: 14,
    y: 1,
    direction: "vertical",
    description:
      "The process of validating and recording transactions on the blockchain by solving complex mathematical problems",
  },
  {
    id: 3,
    level: 1,
    name: "wallet",
    x: 4,
    y: 2,
    direction: "vertical",
    description:
      "A digital tool (software or hardware) that allows users to store and manage their cryptocurrencies.",
  },
  {
    id: 4,
    level: 1,
    name: "blockchain",
    x: 6,
    y: 2,
    direction: "horizontal",
    description:
      "A decentralized digital ledger that records transactions across many computers.",
  },
  {
    id: 5,
    level: 1,
    name: "nft",
    x: 10,
    y: 4,
    direction: "horizontal",
    description: "a unique digital asset verified using blockchain technology.",
  },
  {
    id: 6,
    level: 1,
    name: "fork",
    x: 6,
    y: 6,
    direction: "vertical",
    description:
      "Updates or changes to the blockchain protocol that create a divergence in the blockchain network.",
  },
  {
    id: 7,
    level: 1,
    name: "dapp",
    x: 2,
    y: 6,
    direction: "vertical",
    description:
      "A decentralized application that runs on a blockchain network.",
  },
  {
    id: 8,
    level: 1,
    name: "smartcontract",
    x: 0,
    y: 7,
    direction: "horizontal",
    description:
      "A self-executing contract with the terms of the agreement directly written into code.",
  },
  {
    id: 9,
    level: 1,
    name: "token",
    x: 4,
    y: 9,
    direction: "horizontal",
    description:
      "A digital asset that represents ownership or a stake in a project, often used in blockchain networks.",
  },
  {
    id: 10,
    level: 1,
    name: "node",
    direction: "vertical",
    x: 8,
    y: 9,
    description: `A computer connected to a blockchain network, participating in the network's consensus process`,
  },
  {
    id: 11,
    level: 2,
    name: "DAO",
    direction: "vertical",
    x: 1,
    y: 1,
    description: "",
  },
];

export default words;
