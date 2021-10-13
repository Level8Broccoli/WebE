import { ChatMessage } from "./Chat";

export type Game = {
  id: string;
  creatorId: string;
  players: string[];
  config: Config;
  chat?: ChatMessage[];
  state?: State;
};

export type SimpleGame = {
  id: string;
};

export type Config = {
  maxPlayerCount: number;
};

export type Card = {
  value: number;
  color?: string;
  type: CardType;
};

export enum Color {
  BLUE = "BLUE",
  RED = "RED",
  YELLOW = "YELLOW",
  GREEN = "GREEN",
  VIOLET = "VIOLET",
  ORANGE = "ORANGE",
}

export enum CardType {
  NUMBER = "NUMBER",
  JOKER = "JOKER",
  SKIP = "SKIP",
}

export type State = {
  hands: Hand[];
  drawPile: Card[];
  discardPile?: Array<Card[]>;
};

export type Hand = {
  owner: string;
  cards: Card[];
};
