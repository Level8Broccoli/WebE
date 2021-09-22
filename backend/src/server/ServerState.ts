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

  public get rooms(): Room[] {
    return this._rooms;
  }
}
