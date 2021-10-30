import { DateTime } from "luxon";

export type ChatMessage = {
  timestamp: DateTime,
  playerId: string;
  message: string;
};
