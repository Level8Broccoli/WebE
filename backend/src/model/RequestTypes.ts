import { PrivatePlayer } from "./Player";
import { RoomConfig, SimpleRoom } from "./Room";

export type RegisterPlayerRequest = {
  playerName: string;
};

export type CreateGameRequest = {
  player: PrivatePlayer;
  roomConfig: RoomConfig;
};

export type DeleteGameRequest = {
  player: PrivatePlayer;
  room: SimpleRoom;
};

export type JoinGameRequest = {
  player: PrivatePlayer;
  room: SimpleRoom;
};
