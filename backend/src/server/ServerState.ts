import { Player } from "./Player";
import { Room } from "./Room";

export class ServerState {
  private _players: Player[];
  private _rooms: Room[];

  constructor() {
    this._players = [];
    this._rooms = [];
  }
}
