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

export type Card = NumberCard | SpecialCard;

export type NumberCard = {
  value: number;
  color: string;
  type: CardType.NUMBER;
};

export type SpecialCard = {
  value: 0;
  type: CardType.JOKER | CardType.SKIP;
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
  activePlayerId: string;
  hands: Map<string, Card[]>;
  drawPile: Card[];
  discardPile: Map<string, Card[]>;
};
