import { ChatMessage } from "./Chat";

export enum GameStatus { IN_LOBBY, IN_PROGRESS, FINISHED };

export const DRAW_PILE_ID = "drawPile";

export type Game = {
  id: string;
  creatorId: string;
  players: string[];
  config: Config;
  status: GameStatus;
  chat: ChatMessage[];
  state: GameState;
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
  id: string;
  value: number;
  color: string;
  type: CardType.NUMBER;
};

export type SpecialCard = {
  id: string;
  value: 0;
  color: "NONE";
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

export enum GameStep { DRAW, FULFILL_LEVEL, PLAY, DISCARD }

export type CardStackOpen = {
  id: string;
  cards: Card[];
}

export type CardStackSecret = {
  id: string;
  count: number;
}

export type CardStack = CardStackOpen | CardStackSecret;

export type GameState = {
  activePlayerId: string;
  currentStep: GameStep;
  hands: CardStack[];
  piles: CardStack[]; // Includes the drawPile and the player's discardPile
};

export type PlayerOverviewAggregate = {
  playerId: string;
  isActivePlayer: boolean;
  currentStep: GameStep;
  handCardCount: number;
  discardPile: Card[];
}
