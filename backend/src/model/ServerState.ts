import { PrivatePlayer } from "./Player";
import { Game } from "./Game";

export type ServerState = {
  players: PrivatePlayer[];
  games: Game[];
};
