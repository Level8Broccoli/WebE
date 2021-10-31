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
  levels: GameLevel[];
  state: GameState;
};

export enum GameLevel { LVL1, LVL2, LVL3, LVL4, LVL5, LVL6, LVL7, LVL8 };

export type PlayerLevel = {
  playerId: string;
  currentLevelIndex: number;
  hasAchievedLevel: boolean;
}

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

export enum CardRowType { STREET, SAME_NUMBER, SAME_COLOR };

export type CardRow = {
  type: CardRowType;
  cards: Card[];
}

export type GameState = {
  activePlayerId: string;
  currentStep: GameStep;
  playerLevels: PlayerLevel[];
  hands: CardStack[];
  piles: CardStack[]; // Includes the drawPile and the player's discardPile
  board: CardRow[];
};

export type PlayerOverviewAggregate = {
  playerId: string;
  isActivePlayer: boolean;
  currentStep: GameStep;
  currentLevelIndex: number;
  maxLevelCount: number;
  hasAchievedLevel: boolean;
  handCardCount: number;
  discardPile: Card[];
}


export const GameRules = {
  LVL1: [
    { type: CardRowType.STREET, count: 3 },
    { type: CardRowType.STREET, count: 3 }
  ],
  LVL2: [
    { type: CardRowType.SAME_NUMBER, count: 2 },
    { type: CardRowType.SAME_NUMBER, count: 2 },
    { type: CardRowType.SAME_NUMBER, count: 2 },
    { type: CardRowType.SAME_NUMBER, count: 2 }
  ],
  LVL3: [
    { type: CardRowType.STREET, count: 4 },
    { type: CardRowType.STREET, count: 4 },
  ],
  LVL4: [
    { type: CardRowType.STREET, count: 6 },
    { type: CardRowType.SAME_NUMBER, count: 2 },
  ],
  LVL5: [
    { type: CardRowType.STREET, count: 7 },
  ],
  LVL6: [
    { type: CardRowType.SAME_NUMBER, count: 2 },
    { type: CardRowType.SAME_NUMBER, count: 3 },
    { type: CardRowType.SAME_NUMBER, count: 3 },
  ],
  LVL7: [
    { type: CardRowType.SAME_NUMBER, count: 3 },
    { type: CardRowType.SAME_COLOR, count: 5 },
  ],
  LVL8: [
    { type: CardRowType.SAME_NUMBER, count: 2 },
    { type: CardRowType.SAME_NUMBER, count: 3 },
    { type: CardRowType.SAME_NUMBER, count: 4 },
  ],
}
