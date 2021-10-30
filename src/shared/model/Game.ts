import { ChatMessage } from "./Chat";

export enum GameStatus { IN_LOBBY, IN_PROGRESS, FINISHED };

export type Game = {
  id: string;
  creatorId: string;
  players: string[];
  config: Config;
  status: GameStatus;
  chat: ChatMessage[];
  state: GameState;
};

export type PublicGameTransfer = {
  id: string;
  creatorId: string;
  players: string[];
  config: Config;
  status: GameStatus;
  chat: ChatMessage[];
  state: PublicGameTransferState;
}

export type PublicGame = {
  id: string;
  creatorId: string;
  players: string[];
  config: Config;
  status: GameStatus;
  chat: ChatMessage[];
  state: PublicGameState;
};

export type Config = {
  maxPlayerCount: number;
  levelCount: number;
  levelSystem: LevelSystem;
};

export enum LevelSystem {
  NORMAL = "NORMAL",
  RANDOM = "RANDOM",
}

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

export type GameState = {
  activePlayerId: string;
  hands: Map<string, Card[]>;
  piles: Map<string, Card[]>; // Includes the drawPile and the player's discardPile
};

export type PublicGameState = {
  activePlayerId: string;
  hands: Map<string, Card[] | Number>;
  piles: Map<string, Card[]>; // Includes the drawPile and the player's discardPile
};

export type PublicGameTransferState = {
  activePlayerId: string;
  hands: [string, Card[] | number][];
  piles: [string, Card[]][]; // Includes the drawPile and the player's discardPile
};
