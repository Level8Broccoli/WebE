import moment from "moment";
import { ErrorCode } from "../api/ErrorCode";
import { PublicPlayer, PrivatePlayer } from "./Player";
import { Game, SimpleGame } from "./Game";

export type RegisterPlayerResponse = {
  status: ErrorCode;
  timestamp: moment.Moment;
  player: PrivatePlayer;
  games: Game[];
};

export type CreateGameResponse = {
  status: ErrorCode;
  timestamp: moment.Moment;
  player: PublicPlayer;
  game: Game;
};

export type DeleteGameResponse = {
  status: ErrorCode;
  timestamp: moment.Moment;
  game: SimpleGame;
};

export type JoinGameResponse = {
  status: ErrorCode;
  timestamp: moment.Moment;
  player: PublicPlayer;
  game: SimpleGame;
};

export type LeaveGameResponse = {
  status: ErrorCode;
  timestamp: moment.Moment;
  player: PublicPlayer;
  game: SimpleGame;
};

export type ErrorResponse = {
  status: ErrorCode;
  message: string;
};
