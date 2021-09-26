import { PrivatePlayer } from "./Player";
import { Room } from "./Room";

export type ServerState = {
  players: PrivatePlayer[];
  rooms: Room[];
};
