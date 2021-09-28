import { PrivatePlayer } from "../model/Player";
import { ServerState } from "../model/ServerState";
import { DateTime } from "luxon";
import { StatusCode } from "./StatusCode";
import { getSecret, getUUID } from "../services/TokenGeneratorService";
import {
  ChatRequest,
  CreateGameRequest,
  DeleteGameRequest,
  JoinGameRequest,
  LeaveGameRequest,
  RegisterPlayerRequest,
} from "../model/RequestTypes";
import {
  ChatResponse,
  CreateGameResponse,
  DeleteGameResponse,
  JoinGameResponse,
  LeaveGameResponse,
  RegisterPlayerResponse,
} from "../model/ResponseTypes";
import {
  registerPlayer,
  playerExists,
  createGame,
  canGameBeDeleted,
  deleteGame,
  gameExists,
  freeSpaceInGame,
  joinGame,
  leaveGame,
  playerInGame,
  addChatMessage,
} from "../services/ServerStateService";

export class Api {
  private _serverState: ServerState;

  constructor(serverState: ServerState) {
    this._serverState = serverState;
  }

  registerPlayer(
    request: RegisterPlayerRequest
  ): Promise<RegisterPlayerResponse> {
    return new Promise((resolve, reject) => {
      // [Server] Validation (not empty, valid UTF-8 Symbols) -> Errorfeedback
      if (request.playerName.trim().length === 0) {
        reject(new Error(StatusCode.PLAYER_INVALID));
      }

      // [Server] PlayerId and secret generation
      // [Server] Player add to server state
      const player: PrivatePlayer = {
        id: getUUID(),
        name: request.playerName,
        secret: getSecret(),
      };
      registerPlayer(this._serverState, player);

      // [Server] Get all games
      // [Server] and send response of type: registerPlayer
      const response = {
        status: StatusCode.OK,
        timestamp: DateTime.now(),
        player: player,
        games: this._serverState.games,
      };

      resolve(response);
    });
  }

  createGame(request: CreateGameRequest): Promise<CreateGameResponse> {
    return new Promise((resolve, reject) => {
      // [Server] Validation (playerId + secret, no invalid rules) -> Errorfeedback
      if (!playerExists(this._serverState, request.player)) {
        reject(new Error(StatusCode.PLAYER_INVALID));
      }

      // TBD: Check rules
      if (request.config === undefined) {
        reject(new Error(StatusCode.GAME_CONFIG_INVALID));
      }

      // [Server] Generate gameId
      // [Server] Add game to server state
      const game = {
        id: getUUID(),
        creatorId: request.player.id,
        config: request.config,
        players: [request.player.id],
        chat: [],
      };

      createGame(this._serverState, game);

      // [Server] Send response of type: createGame to all clients
      const response = {
        status: StatusCode.OK,
        timestamp: DateTime.now(),
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
      // [Server] Validation (playerId + Secret + gameId, playerId must be equal to creatorId of game) -> Errorfeedback
      if (!playerExists(this._serverState, request.player)) {
        reject(new Error(StatusCode.PLAYER_INVALID));
      }

      if (!canGameBeDeleted(this._serverState, request.game, request.player)) {
        reject(new Error(StatusCode.GAME_CREATOR_INVALID));
      }

      // [Server] Remove game from server state
      deleteGame(this._serverState, request.game);

      // [Server] Send response of type: deleteGame to all clients
      const response = {
        status: StatusCode.OK,
        timestamp: DateTime.now(),
        game: {
          id: request.game.id,
        },
      };

      resolve(response);
    });
  }

  joinGame(request: JoinGameRequest): Promise<JoinGameResponse> {
    return new Promise((resolve, reject) => {
      // [Server] Validation (playerId + Secret, is there a free place in the game room?) -> Errorfeedback
      if (!playerExists(this._serverState, request.player)) {
        reject(new Error(StatusCode.PLAYER_INVALID));
      }

      if (!gameExists(this._serverState, request.game)) {
        reject(new Error(StatusCode.GAME_NOT_EXISTS));
      }

      if (!freeSpaceInGame(this._serverState, request.game)) {
        reject(
          new Error(
            "Game cannot be joined. Game has no available space for new player."
          )
        );
      }

      // [Server] Add playerId to the requested game in server state
      joinGame(this._serverState, request.player, request.game);

      // [Server] Send response of type: joinGame to all clients
      const response = {
        status: StatusCode.OK,
        timestamp: DateTime.now(),
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

  leaveGame(request: LeaveGameRequest): Promise<LeaveGameResponse> {
    return new Promise((resolve, reject) => {
      // [Server] Validation (playerId + Secret) -> Errorfeedback
      if (!playerExists(this._serverState, request.player)) {
        reject(new Error(StatusCode.PLAYER_INVALID));
      }

      // [Server] Remove playerId in the requested game
      leaveGame(this._serverState, request.player, request.game);

      // [Server] Send response of type: leaveGame to all clients
      const response = {
        status: StatusCode.OK,
        timestamp: DateTime.now(),
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

  chat(request: ChatRequest): Promise<ChatResponse> {
    return new Promise((resolve, reject) => {
      // [Server] Validation (playerId + Secret) -> Errorfeedback
      if (!playerExists(this._serverState, request.player)) {
        reject(new Error(StatusCode.PLAYER_INVALID));
      }

      // [Server] Check if player exists in game
      if (!playerInGame(this._serverState, request.player, request.game)) {
        reject(new Error(StatusCode.PLAYER_ROOM_INVALID));
      }

      // [Server] Add chat message to the corresponding game
      const message = {
        player: {
          id: request.player.id,
          name: request.player.name,
        },
        message: request.message,
      };

      addChatMessage(this._serverState, request.game, message);

      const response = {
        timestamp: DateTime.now(),
        player: {
          id: request.player.id,
          name: request.player.name,
        },
        message: request.message,
      };

      resolve(response);
    });
  }
}
