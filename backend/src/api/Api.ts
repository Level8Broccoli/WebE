import { PrivatePlayer } from "../model/Player";
import { ServerState } from "../model/ServerState";
import { DateTime } from "luxon";
import { ErrorCode } from "./ErrorCode";
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
  isFreePlaceInGameAvailabe,
  joinGame,
  leaveGame,
  playerInGame,
  addChatMessage,
} from "../services/ServerStateService";

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
      // [Server] Validation (not empty, valid UTF-8 Symbols) -> Errorfeedback
      if (request.playerName.length === 0 || request.playerName === "") {
        throw new Error("Player name is empty.");
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
        status: ErrorCode.OK,
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
        throw new Error("Id / secret combination not valid.");
      }

      // TBD: Check rules
      if (request.gameConfig === undefined) {
        throw new Error("No game config set.");
      }

      // [Server] Generate gameId
      // [Server] Add game to server state
      const game = {
        id: getUUID(),
        creatorId: request.player.id,
        gameConfig: request.gameConfig,
        players: [request.player.id],
        chat: [],
      };

      createGame(this._serverState, game);

      // [Server] Send response of type: createGame to all clients
      const response = {
        status: ErrorCode.OK,
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
        throw new Error("Id / secret combination not valid.");
      }

      if (!canGameBeDeleted(this._serverState, request.game, request.player)) {
        throw new Error(
          "Game / creator combination not valid. Cannot delete game."
        );
      }

      // [Server] Remove game from server state
      deleteGame(this._serverState, request.game);

      // [Server] Send response of type: deleteGame to all clients
      const response = {
        status: ErrorCode.OK,
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

      // [Server] Add playerId to the requested game in server state
      joinGame(this._serverState, request.player, request.game);

      // [Server] Send response of type: joinGame to all clients
      const response = {
        status: ErrorCode.OK,
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
        throw new Error("Id / secret combination not valid.");
      }

      // [Server] Remove playerId in the requested game
      leaveGame(this._serverState, request.player, request.game);

      // [Server] Send response of type: leaveGame to all clients
      const response = {
        status: ErrorCode.OK,
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
        throw new Error("Id / secret combination not valid.");
      }

      // [Server] Check if player exists in game
      if (!playerInGame(this._serverState, request.player, request.game)) {
        throw new Error(
          "Player cannot chat with room, because he is not part of it"
        );
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
