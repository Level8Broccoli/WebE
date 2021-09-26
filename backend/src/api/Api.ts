import { PrivatePlayer } from "../model/Player";
import { ServerState } from "../model/ServerState";
import moment from "moment";
import { ErrorCode } from "./ErrorCode";
import { getSecret, getUUID } from "./services/TokenGeneratorService";
import {
  CreateGameRequest,
  DeleteGameRequest,
  JoinGameRequest,
  RegisterPlayerRequest,
} from "../model/RequestTypes";
import {
  CreateGameResponse,
  DeleteGameResponse,
  JoinGameResponse,
  RegisterPlayerResponse,
} from "../model/ResponseTypes";
import {
  registerPlayer,
  playerExists,
  createGame,
  canRoomBeDeleted,
  deleteGame,
  roomExists,
  isFreePlaceInRoomAvailabe,
  joinGame,
} from "./services/ServerStateService";

const DATE_TIME_FORMAT = "YYYY-MM-DDThh:mm:ss";

export class Api {
  private _serverState: ServerState;

  constructor(serverState: ServerState) {
    this._serverState = serverState;
  }

  registerPlayer(
    request: RegisterPlayerRequest
  ): Promise<RegisterPlayerResponse> {
    return new Promise((resolve, reject) => {
      // [Server] Validation (nicht leer, gültige UTF-8 Zeichen) -> Errorfeedback
      if (request.playerName.length === 0 || request.playerName === "") {
        throw new Error("Player name is empty.");
      }

      // [Server] PlayerId und Secret generieren
      // [Server] Player in ServerState anlegen
      const player: PrivatePlayer = {
        id: getUUID(),
        name: request.playerName,
        secret: getSecret(),
      };
      registerPlayer(this._serverState, player);

      // [Server] Liste aller aktiven Spielräume abfragen
      // [Server] Response senden
      const response = {
        status: ErrorCode.OK,
        timestamp: moment(new Date(), DATE_TIME_FORMAT),
        player: player,
        rooms: this._serverState.rooms,
      };

      resolve(response);
    });
  }

  createGame(request: CreateGameRequest): Promise<CreateGameResponse> {
    return new Promise((resolve, reject) => {
      // [Server] Validation (playerId + Secret, keine ungültigen Regeln) -> Errorfeedback
      if (!playerExists(this._serverState, request.player)) {
        throw new Error("Id / secret combination not valid.");
      }

      // TBD: Regeln überprüfen
      if (request.roomConfig === undefined) {
        throw new Error("No roomconfig set.");
      }

      // [Server] RoomId generieren
      // [Server] Game in ServerState anlegen (Konfiguration, Ersteller)
      const room = {
        id: getUUID(),
        creatorId: request.player.id,
        roomConfig: request.roomConfig,
        players: [request.player.id],
      };

      createGame(this._serverState, room);

      // [Server] Nachricht (type: createGame) an alle Clients
      const response = {
        status: ErrorCode.OK,
        timestamp: moment(new Date(), DATE_TIME_FORMAT),
        player: {
          id: request.player.id,
          name: request.player.name,
        },
        room: room,
      };

      resolve(response);
    });
  }

  deleteGame(request: DeleteGameRequest): Promise<DeleteGameResponse> {
    return new Promise((resolve, reject) => {
      // [Server] Validation (playerId + Secret + roomId, playerId muss Spielraum-Ersteller sein) -> Errorfeedback
      if (!playerExists(this._serverState, request.player)) {
        throw new Error("Id / secret combination not valid.");
      }

      if (!canRoomBeDeleted(this._serverState, request.room, request.player)) {
        throw new Error(
          "Room / creator combination not valid. Cannot delete room."
        );
      }

      // [Server] Game in ServerState entfernen
      deleteGame(this._serverState, request.room);

      // [Server] Nachricht (type: deleteGame) an alle Clients
      const response = {
        status: ErrorCode.OK,
        timestamp: moment(new Date(), DATE_TIME_FORMAT),
        room: {
          id: request.room.id,
        },
      };

      resolve(response);
    });
  }

  joinGame(request: JoinGameRequest): Promise<JoinGameResponse> {
    return new Promise((resolve, reject) => {
      // [Server] Validation (playerId + Secret, Spielraum hat noch Plätze frei) -> Errorfeedback
      if (!playerExists(this._serverState, request.player)) {
        throw new Error("Id / secret combination not valid.");
      }

      if (!roomExists(this._serverState, request.room)) {
        throw new Error("Room with id does not exist.");
      }

      if (!isFreePlaceInRoomAvailabe(this._serverState, request.room)) {
        throw new Error(
          "Room cannot be joined. Room has no available space for new player."
        );
      }

      // [Server] PlayerId in ServerState -> Game als Spieler hinzufügen
      joinGame(this._serverState, request.player, request.room);

      // [Server] Nachricht (type: joinGame) an alle Clients
      const response = {
        status: ErrorCode.OK,
        timestamp: moment(new Date(), DATE_TIME_FORMAT),
        player: {
          id: request.player.id,
          name: request.player.name,
        },
        room: {
          id: request.room.id,
        },
      };

      resolve(response);
    });
  }
}
