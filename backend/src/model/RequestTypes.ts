import { PrivatePlayer } from "./Player";
import { Config, SimpleGame } from "./Game";

export type RegisterPlayerRequest = {
  playerName: string;
};

export type EditPlayerNameRequest = {
  player: PrivatePlayer
}

export type CreateGameRequest = {
  player: PrivatePlayer;
  config: Config;
};

export type DeleteGameRequest = {
  player: PrivatePlayer;
  game: SimpleGame;
};

export type JoinGameRequest = {
  player: PrivatePlayer;
  game: SimpleGame;
};

export type LeaveGameRequest = {
  player: PrivatePlayer;
  game: SimpleGame;
};

export type ChatRequest = {
  player: PrivatePlayer;
  game: SimpleGame;
  message: string;
};
