import { FullPlayer } from "./Player";
import { Game } from "./Game";

export type ServerState = {
  players: FullPlayer[];
  games: Game[];
};
