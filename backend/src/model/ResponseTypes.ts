import { DateTime } from "luxon";
import { ErrorCode } from "../api/ErrorCode";
import { PublicPlayer, PrivatePlayer } from "./Player";
import { Game, SimpleGame } from "./Game";

export type RegisterPlayerResponse = {
  status: ErrorCode;
  timestamp: DateTime;
  player: PrivatePlayer;
  games: Game[];
};

export type CreateGameResponse = {
  status: ErrorCode;
  timestamp: DateTime;
  player: PublicPlayer;
  game: Game;
};

export type DeleteGameResponse = {
  status: ErrorCode;
  timestamp: DateTime;
  game: SimpleGame;
};

export type JoinGameResponse = {
  status: ErrorCode;
  timestamp: DateTime;
  player: PublicPlayer;
  game: SimpleGame;
};

export type LeaveGameResponse = {
  status: ErrorCode;
  timestamp: DateTime;
  player: PublicPlayer;
  game: SimpleGame;
};

export type ChatResponse = {
  timestamp: DateTime;
  player: PublicPlayer;
  message: string;
};

export type ErrorResponse = {
  status: ErrorCode;
  message: string;
};
