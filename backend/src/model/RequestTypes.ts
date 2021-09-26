import { PrivatePlayer } from "./Player";
import { GameConfig, SimpleGame } from "./Game";

export type RegisterPlayerRequest = {
  playerName: string;
};

export type CreateGameRequest = {
  player: PrivatePlayer;
  gameConfig: GameConfig;
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
