import { Player } from "../server/Player";
import { ServerState } from "../server/ServerState";
import { ITokenGenerator } from "../util/ITokenGenerator";
import moment from "moment";
import { ErrorCode } from "./ErrorCode";
import { Room } from "../server/Room";
import { RoomConfig } from "../server/RoomConfig";

const DATE_TIME_FORMAT = "YYYY-MM-DDThh:mm:ss";

export class Api {
  private _serverState: ServerState;
  private _tokenGenerator: ITokenGenerator;

  constructor(serverState: ServerState, tokenGenerator: ITokenGenerator) {
    this._serverState = serverState;
    this._tokenGenerator = tokenGenerator;
  }

  registerPlayer(request: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const json = JSON.parse(request);

      // [Server] Validation (nicht leer, gültige UTF-8 Zeichen) -> Errorfeedback
      if (json.playerName.length === 0 || json.playerName === "") {
        throw new Error("Player name is empty.");
      }

      // [Server] PlayerId und Secret generieren
      const id = this._tokenGenerator.getUUID();
      const secret = this._tokenGenerator.getSecret();
      const name = json.playerName;

      // [Server] Player in ServerState anlegen
      const player = new Player(id, name, secret);
      this._serverState.registerPlayer(player);

      // [Server] Liste aller aktiven Spielräume abfragen
      const rooms = this._serverState.rooms;

      // [Server] Response senden
      const response = {
        status: ErrorCode.OK,
        timestamp: moment(new Date(), DATE_TIME_FORMAT),
        player: player,
        rooms: rooms,
      };

      resolve(response);
    });
  }

  createGame(request: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const json = JSON.parse(request);

      // [Server] Validation (playerId + Secret, keine ungültigen Regeln) -> Errorfeedback
      if (!this._serverState.playerExist(json.player.id, json.player.secret)) {
        throw new Error("Id / secret combination not valid.");
      }

      // TBD: Regeln überprüfen

      // [Server] RoomId generieren
      const id = this._tokenGenerator.getUUID();

      // [Server] Game in ServerState anlegen (Konfiguration, Ersteller)
      const roomConfig = new RoomConfig(json.roomConfig.maxPlayerCountForRoom);
      const room = new Room(id, json.player.id, roomConfig);
      this._serverState.createGame(room);

      // [Server] Nachricht (type: createGame) an alle Clients
      const response = {
        status: ErrorCode.OK,
        timestamp: moment(new Date(), DATE_TIME_FORMAT),
        player: {
          id: json.player.id,
          name: json.player.name,
        },
        room: room,
      };

      resolve(response);
    });
  }

  deleteGame(request: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const json = JSON.parse(request);

      // [Server] Validation (playerId + Secret + roomId, playerId muss Spielraum-Ersteller sein) -> Errorfeedback
      if (!this._serverState.playerExist(json.player.id, json.player.secret)) {
        throw new Error("Id / secret combination not valid.");
      }

      if (!this._serverState.roomExist(json.room.id, json.player.id)) {
        throw new Error(
          "Room / creator combination not valid. Cannot delete room."
        );
      }

      // [Server] Game in ServerState entfernen
      this._serverState.deleteGame(json.room.id);

      // [Server] Nachricht (type: deleteGame) an alle Clients
      const response = {
        status: ErrorCode.OK,
        timestamp: moment(new Date(), DATE_TIME_FORMAT),
        room: {
          id: json.room.id,
        },
      };

      resolve(response);
    });
  }
}
