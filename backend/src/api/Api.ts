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
  canGameBeDeleted,
  deleteGame,
  gameExists,
  isFreePlaceInGameAvailabe,
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
        games: this._serverState.games,
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
      if (request.gameConfig === undefined) {
        throw new Error("No game config set.");
      }

      // [Server] gameId generieren
      // [Server] Game in ServerState anlegen (Konfiguration, Ersteller)
      const game = {
        id: getUUID(),
        creatorId: request.player.id,
        gameConfig: request.gameConfig,
        players: [request.player.id],
      };

      createGame(this._serverState, game);

      // [Server] Nachricht (type: createGame) an alle Clients
      const response = {
        status: ErrorCode.OK,
        timestamp: moment(new Date(), DATE_TIME_FORMAT),
        player: {
          id: request.player.id,
          name: request.player.name,
        },
        game: game,
      };

      resolve(response);
    });
  }

  deleteGame(request: DeleteGameRequest): Promise<DeleteGameResponse> {
    return new Promise((resolve, reject) => {
      // [Server] Validation (playerId + Secret + gameId, playerId muss Spielraum-Ersteller sein) -> Errorfeedback
      if (!playerExists(this._serverState, request.player)) {
        throw new Error("Id / secret combination not valid.");
      }

      if (!canGameBeDeleted(this._serverState, request.game, request.player)) {
        throw new Error(
          "Game / creator combination not valid. Cannot delete game."
        );
      }

      // [Server] Game in ServerState entfernen
      deleteGame(this._serverState, request.game);

      // [Server] Nachricht (type: deleteGame) an alle Clients
      const response = {
        status: ErrorCode.OK,
        timestamp: moment(new Date(), DATE_TIME_FORMAT),
        game: {
          id: request.game.id,
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

      if (!gameExists(this._serverState, request.game)) {
        throw new Error("Game with id does not exist.");
      }

      if (!isFreePlaceInGameAvailabe(this._serverState, request.game)) {
        throw new Error(
          "Game cannot be joined. Game has no available space for new player."
        );
      }

      // [Server] PlayerId in ServerState -> Game als Spieler hinzufügen
      joinGame(this._serverState, request.player, request.game);

      // [Server] Nachricht (type: joinGame) an alle Clients
      const response = {
        status: ErrorCode.OK,
        timestamp: moment(new Date(), DATE_TIME_FORMAT),
        player: {
          id: request.player.id,
          name: request.player.name,
        },
        game: {
          id: request.game.id,
        },
      };

      resolve(response);
    });
  }
}
