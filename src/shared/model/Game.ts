import { ChatMessage } from "./Chat";

export enum GameViewType { NONE, IN_CREATION, IN_LOBBY, IN_PROGRESS };

type NoGameSelectedView = {
  type: GameViewType.NONE;
  data: null;
};

type GameInCreationView = {
  type: GameViewType.IN_CREATION;
  data: Config;
};

type GameInLobbyView = {
  type: GameViewType.IN_LOBBY;
  data: Game;
};

type GameInProgressView = {
  type: GameViewType.IN_PROGRESS;
  data: Game;
};

export type GameView =
  | NoGameSelectedView
  | GameInCreationView
  | GameInLobbyView
  | GameInProgressView;

export type Game = {
  id: string;
  creatorId: string;
  players: string[];
  config: Config;
  chat?: ChatMessage[];
  state?: State;
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

export type State = {
  activePlayerId: string;
  hands: Map<string, Card[]>;
  piles: Map<string, Card[]>; // Includes the drawPile and the player's discardPile
};
