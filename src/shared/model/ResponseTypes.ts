import { DateTime } from "luxon";
import { StatusCode } from "../api/StatusCode";
import { Card, Game, PublicGameTransfer } from "./Game";
import { PrivatePlayer, PublicPlayer } from "./Player";

export type RegisterPlayerResponse = {
  status: StatusCode;
  timestamp: DateTime;
  player: PrivatePlayer;
  games: PublicGameTransfer[];
};

export type LogoutResponse = {
  status: StatusCode;
  timestamp: DateTime;
  playerId: string;
};

export type RegisterExistingPlayerResponse = {
  status: StatusCode;
  timestamp: DateTime;
  player: PrivatePlayer;
  games: PublicGameTransfer[];
  activeGameId: string;
};

export type EditPlayerNameResponse = {
  status: StatusCode;
  timestamp: DateTime;
  player: PrivatePlayer;
};

export type UpdatePlayerListResponse = { playerList: PublicPlayer[] }

export type UpdateGameListResponse = { gameList: PublicGameTransfer[] }

export type CreateGameResponse = {
  status: StatusCode;
  timestamp: DateTime;
  player: PublicPlayer;
  game: Game;
};

export type DeleteGameResponse = {
  status: StatusCode;
  timestamp: DateTime;
  gameId: string;
};

export type JoinGameResponse = {
  status: StatusCode;
  timestamp: DateTime;
  player: PublicPlayer;
  game: Game;
};

export type LeaveGameResponse = {
  status: StatusCode;
  timestamp: DateTime;
  player: PublicPlayer;
  gameId: string;
};

export type ChatResponse = {
  timestamp: DateTime;
  playerId: string;
  message: string;
};

export type ErrorResponse = {
  status: StatusCode;
};

export type StartGameResponse = {
  status: StatusCode;
  timestamp: DateTime;
  gameId: string;
};

export type StartMoveResponse = {
  timestamp: DateTime;
  player: {
    id: string;
  };
};

export type UpdateGameBoardResponse = {
  status: StatusCode;
  timestamp: DateTime;
  gameId: string;
};
