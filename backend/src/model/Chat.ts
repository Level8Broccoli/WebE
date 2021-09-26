import { PublicPlayer } from "./Player";

export type ChatMessage = {
  player: PublicPlayer;
  message: string;
};
