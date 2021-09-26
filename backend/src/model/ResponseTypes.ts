import moment from "moment";
import { ErrorCode } from "../api/ErrorCode";
import { PublicPlayer, PrivatePlayer } from "./Player";
import { Room, SimpleRoom } from "./Room";

export type RegisterPlayerResponse = {
  status: ErrorCode;
  timestamp: moment.Moment;
  player: PrivatePlayer;
  rooms: Room[];
};

export type CreateGameResponse = {
  status: ErrorCode;
  timestamp: moment.Moment;
  player: PublicPlayer;
  room: Room;
};

export type DeleteGameResponse = {
  status: ErrorCode;
  timestamp: moment.Moment;
  room: SimpleRoom;
};

export type JoinGameResponse = {
  status: ErrorCode;
  timestamp: moment.Moment;
  player: PublicPlayer;
  room: SimpleRoom;
};

export type ErrorResponse = {
  status: ErrorCode;
  message: string;
};
