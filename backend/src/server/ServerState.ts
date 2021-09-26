import { Player } from "./Player";
import { Room } from "./Room";

export class ServerState {
  private _players: Player[];
  private _rooms: Room[];

  constructor() {
    this._players = [];
    this._rooms = [];
  }

  registerPlayer(player: Player) {
    this._players.push(player);
  }

  createGame(room: Room) {
    this._rooms.push(room);
  }

  public get rooms(): Room[] {
    return this._rooms;
  }

  playerExist(id: string, secret: string): boolean {
    const filtered = this._players.filter(
      (p) => p.id === id && p.secret === secret
    );

    return filtered.length !== 0 ? true : false;
  }

  roomExist(roomId: string, creatorId: string): boolean {
    const filtered = this._rooms.filter(
      (r) => r.id === roomId && r.creatorId === creatorId
    );

    return filtered.length !== 0 ? true : false;
  }

  deleteGame(roomId: string) {
    this._rooms = this._rooms.splice(
      this._rooms.findIndex((room) => room.id === roomId),
      1
    );
  }
}
