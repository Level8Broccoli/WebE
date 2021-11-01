import { PrivatePlayer } from "./Player";
import { Card, Config } from "./Game";

export type RegisterPlayerRequest = {
  playerName: string;
};

export type EditPlayerNameRequest = {
  player: PrivatePlayer;
};

export type RegisterExistingPlayerRequest = {
  player: PrivatePlayer;
};

export type LogoutRequest = {
  player: PrivatePlayer;
};

export type CreateGameRequest = {
  player: PrivatePlayer;
  config: Config;
};

export type DeleteGameRequest = {
  player: PrivatePlayer;
  gameId: string;
};

export type JoinGameRequest = {
  player: PrivatePlayer;
  gameId: string;
};

export type LeaveGameRequest = {
  player: PrivatePlayer;
  gameId: string;
};

export type ChatRequest = {
  player: PrivatePlayer;
  gameId: string;
  message: string;
};

export type StartGameRequest = {
  player: PrivatePlayer;
  gameId: string;
};

export type DrawCardRequest = {
  player: PrivatePlayer;
  gameId: string;
  pileId: string;
};

export type DiscardCardRequest = {
  player: PrivatePlayer;
  gameId: string;
  cardId: string;
};

export type SkipLevelFulfillStepRequest = {
  player: PrivatePlayer;
  gameId: string;
}

export type FinishFulfillmentRequest = {
  player: PrivatePlayer;
  gameId: string;
  cardIdList: string[][];
}
