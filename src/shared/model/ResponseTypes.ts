import { DateTime } from "luxon";
import { StatusCode } from "../api/StatusCode";
import { PublicPlayer, PrivatePlayer } from "./Player";
import { Card, Game, Hand, SimpleGame } from "./Game";

export type RegisterPlayerResponse = {
  status: StatusCode;
  timestamp: DateTime;
  player: PrivatePlayer;
  games: Game[];
};

export type EditPlayerNameResponse = {
  status: StatusCode;
  timestamp: DateTime;
  player: PrivatePlayer;
};

export type CreateGameResponse = {
  status: StatusCode;
  timestamp: DateTime;
  player: PublicPlayer;
  game: Game;
};

export type DeleteGameResponse = {
  status: StatusCode;
  timestamp: DateTime;
  game: SimpleGame;
};

export type JoinGameResponse = {
  status: StatusCode;
  timestamp: DateTime;
  player: PublicPlayer;
  game: SimpleGame;
};

export type LeaveGameResponse = {
  status: StatusCode;
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
  status: StatusCode;
};

export type StartGameResponse = {
  timestamp: DateTime;
  drawPileTop: Card;
  hand: Hand;
};

export type StartRoundResponse = {
  timestamp: DateTime;
  playerOnMove: string;
};