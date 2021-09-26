import { ChatMessage } from "./Chat";

export type Game = {
  id: string;
  creatorId: string;
  players: string[];
  gameConfig: GameConfig;
  chat: ChatMessage[];
};

export type SimpleGame = {
  id: string;
};

export type GameConfig = {
  maxPlayerCountForGame: number;
};
