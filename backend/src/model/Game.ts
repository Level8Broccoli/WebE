import { ChatMessage } from "./Chat";

export type Game = {
  id: string;
  creatorId: string;
  players: string[];
  config: Config;
  chat: ChatMessage[];
};

export type SimpleGame = {
  id: string;
};

export type Config = {
  maxPlayerCountForGame: number;
};
