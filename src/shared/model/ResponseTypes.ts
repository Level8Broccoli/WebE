import { DateTime } from "luxon";
import { StatusCode } from "../api/StatusCode";
import { PublicPlayer, PrivatePlayer, SimplePlayer } from "./Player";
import { Card, Game } from "./Game";

export type RegisterPlayerResponse = {
  status: StatusCode;
  timestamp: DateTime;
  player: PrivatePlayer;
  games: Game[];
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
  games: Game[];
  activeGameId: string;
};

export type EditPlayerNameResponse = {
  status: StatusCode;
  timestamp: DateTime;
  player: PrivatePlayer;
};

export type UpdatePlayerListResponse = { playerList: PublicPlayer[] }

export type UpdateGameListResponse = { gameList: Game[] }

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
  timestamp: DateTime;
  player: SimplePlayer;
  piles: Array<[string, Card]>; // Map<string, Card> as array;
  hand: Card[];
};

export type StartMoveResponse = {
  timestamp: DateTime;
  player: {
    id: string;
  };
};

export type DrawCardResponse = {
  timestamp: DateTime;
  card: Card;
};

export type UpdateGameBoardResponse = {
  timestamp: DateTime;
  piles: Array<[string, Card]>; // Map<string, Card> as array;
};
