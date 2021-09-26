import { RoomConfig } from "./RoomConfig";

export class Room {
  public id: string;
  public creatorId: string;
  public players: string[];
  public roomConfig: RoomConfig;

  constructor(id: string, creatorId: string, roomConfig: RoomConfig) {
    this.id = id;
    this.creatorId = creatorId;
    this.players = [];
    this.players.push(creatorId);
    this.roomConfig = roomConfig;
  }

  join(playerId: string) {
    this.players.push(playerId);
  }
}
