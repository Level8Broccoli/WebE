import { DateTime } from "luxon";
import { StatusCode } from "../../shared/api/StatusCode";
import { toKeyValueArray } from "../../shared/helper/HelperService";
import { GameStatus, GameStep, LevelSystem } from "../../shared/model/Game";
import { FullPlayer } from "../../shared/model/Player";
import {
  ChatRequest,
  CreateGameRequest,
  DeleteGameRequest,
  DiscardCardRequest,
  DrawCardRequest,
  EditPlayerNameRequest,
  JoinGameRequest,
  LeaveGameRequest,
  LogoutRequest,
  RegisterExistingPlayerRequest,
  RegisterPlayerRequest,
  StartGameRequest
} from "../../shared/model/RequestTypes";
import {
  ChatResponse,
  CreateGameResponse,
  DeleteGameResponse,
  DrawCardResponse,
  EditPlayerNameResponse,
  JoinGameResponse,
  LeaveGameResponse,
  LogoutResponse,
  RegisterExistingPlayerResponse,
  RegisterPlayerResponse,
  StartGameResponse,
  UpdateGameBoardResponse
} from "../../shared/model/ResponseTypes";
import { ServerState } from "../../shared/model/ServerState";
import {
  discardCard,
  getAllGames,
  getGame,
  getGameState, getPlayerIdList, initGameState, isCardOwner,
  nextGameStep,
  nextPlayer,
  pileExists,
  startGameState
} from "../services/GameService";
import {
  activePlayerInGame, addChatMessage, createGame,
  deleteGame, deleteOwnGame, editPlayerName, freeSpaceInGame, gameExists, getActiveGame, isCreator, isPlayerCountValid, joinGame,
  leaveGame, playerExists, playerInGame, playerToSocketId, registerExistingPlayer, registerPlayer, removePlayerFromJoinedGame, removePlayerFromPlayerList
} from "../services/ServerStateService";
import { getSecret, getUUID } from "../services/TokenGeneratorService";

export class Api {
  private _serverState: ServerState;

  constructor(serverState: ServerState) {
    this._serverState = serverState;
  }

  registerPlayer(
    request: RegisterPlayerRequest,
    socketId: string
  ): Promise<RegisterPlayerResponse> {
    return new Promise((resolve, reject) => {
      // [Server] Validation (not empty, valid UTF-8 Symbols) -> Errorfeedback
      if (request.playerName.trim().length === 0) {
        reject(new Error(StatusCode.PLAYER_INVALID));
      }

      // [Server] PlayerId and secret generation
      // [Server] Player add to server state
      const player: FullPlayer = {
        id: getUUID(),
        name: request.playerName,
        secret: getSecret(),
        socketId: socketId,
      };
      registerPlayer(this._serverState, player);

      // [Server] Get all games
      // [Server] and send response of type: registerPlayer
      const response: RegisterPlayerResponse = {
        status: StatusCode.OK,
        timestamp: DateTime.now(),
        player: player,
        games: getAllGames(this._serverState, player.id),
      };

      resolve(response);
    });
  }

  logoutPlayer(request: LogoutRequest): Promise<LogoutResponse> {
    return new Promise((resolve, reject) => {
      // [Server] Validation (not empty, valid UTF-8 Symbols) -> Errorfeedback
      if (request.player.name.trim().length === 0) {
        reject(new Error(StatusCode.PLAYER_INVALID));
      }

      // [Server] Validation (playerId + secret, no invalid rules) -> Errorfeedback
      if (!playerExists(this._serverState, request.player)) {
        reject(new Error(StatusCode.PLAYER_INVALID));
      }

      // [Server] Delete games, if player is creator
      deleteOwnGame(this._serverState, request.player.id);

      // [Server] Remove player from joined game
      removePlayerFromJoinedGame(this._serverState, request.player.id);

      // [Server] Remove player from global player list
      removePlayerFromPlayerList(this._serverState, request.player.id);

      const response: LogoutResponse = {
        status: StatusCode.OK,
        timestamp: DateTime.now(),
        playerId: request.player.id,
      };

      resolve(response);
    });
  }

  registerExistingPlayer(
    request: RegisterExistingPlayerRequest,
    socketId: string
  ): Promise<RegisterExistingPlayerResponse> {
    return new Promise((resolve, reject) => {
      // [Server] Validation (not empty, valid UTF-8 Symbols) -> Errorfeedback
      if (request.player.name.trim().length === 0) {
        reject(new Error(StatusCode.PLAYER_INVALID));
      }

      // [Server] Validation (playerId + secret, no invalid rules) -> Errorfeedback
      if (!playerExists(this._serverState, request.player)) {
        reject(new Error(StatusCode.PLAYER_INVALID));
      }

      // [Server] Edit player name
      registerExistingPlayer(this._serverState, request.player, socketId);

      // [Server] Get all games
      // [Server] and send response of type: registerPlayer
      const response: RegisterExistingPlayerResponse = {
        status: StatusCode.OK,
        timestamp: DateTime.now(),
        player: request.player,
        games: getAllGames(this._serverState, request.player.id),
        activeGameId: getActiveGame(this._serverState.games, request.player.id)?.id || "",
      };

      resolve(response);
    });
  }

  editPlayerName(
    request: EditPlayerNameRequest
  ): Promise<EditPlayerNameResponse> {
    return new Promise((resolve, reject) => {
      // [Server] Validation (not empty, valid UTF-8 Symbols) -> Errorfeedback
      if (request.player.name.trim().length === 0) {
        reject(new Error(StatusCode.PLAYER_INVALID));
      }

      // [Server] Validation (playerId + secret, no invalid rules) -> Errorfeedback
      if (!playerExists(this._serverState, request.player)) {
        reject(new Error(StatusCode.PLAYER_INVALID));
      }

      // [Server] Edit player name
      editPlayerName(this._serverState, request.player);


      // [Server] send response of type: registerPlayer
      const response: EditPlayerNameResponse = {
        status: StatusCode.OK,
        timestamp: DateTime.now(),
        player: request.player,
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

      // Check rules
      if (request.config === undefined) {
        reject(new Error(StatusCode.GAME_CONFIG_INVALID));
      }

      if (
        request.config.maxPlayerCount < 1 ||
        request.config.maxPlayerCount > 6
      ) {
        reject(new Error(StatusCode.INVALID_MAX_PLAYER_COUNT));
      }

      if (request.config.levelCount < 2 || request.config.levelCount > 8) {
        reject(new Error(StatusCode.INVALID_LEVEL_COUNT));
      }

      if (
        request.config.levelSystem !== LevelSystem.NORMAL &&
        request.config.levelSystem !== LevelSystem.RANDOM
      ) {
        reject(new Error(StatusCode.INVALID_LEVEL_SYSTEM));
      }

      // [Server] Generate gameId
      // [Server] Add game to server state
      const game = {
        id: getUUID(),
        creatorId: request.player.id,
        config: request.config,
        players: [request.player.id],
        chat: [],
        status: GameStatus.IN_LOBBY,
        state: initGameState(),
      };

      createGame(this._serverState, game);

      // [Server] Send response of type: createGame to all clients
      const response: CreateGameResponse = {
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

      if (!isCreator(this._serverState, request.gameId, request.player)) {
        reject(new Error(StatusCode.GAME_CREATOR_INVALID));
      }

      // [Server] Remove game from server state
      deleteGame(this._serverState, request.gameId);

      // [Server] Send response of type: deleteGame to all clients
      const response: DeleteGameResponse = {
        status: StatusCode.OK,
        timestamp: DateTime.now(),
        gameId: request.gameId,
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

      if (!gameExists(this._serverState, request.gameId)) {
        reject(new Error(StatusCode.GAME_NOT_EXISTS));
      }

      if (!freeSpaceInGame(this._serverState, request.gameId)) {
        reject(new Error(StatusCode.GAME_FULL));
      }

      // [Server] Add playerId to the requested game in server state
      joinGame(this._serverState, request.player, request.gameId);

      // [Server] Send response of type: joinGame to all clients
      const response: JoinGameResponse = {
        status: StatusCode.OK,
        timestamp: DateTime.now(),
        player: {
          id: request.player.id,
          name: request.player.name,
        },
        game: getGame(this._serverState, request.gameId)!,
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
      leaveGame(this._serverState, request.player, request.gameId);

      // [Server] Send response of type: leaveGame to all clients
      const response: LeaveGameResponse = {
        status: StatusCode.OK,
        timestamp: DateTime.now(),
        player: {
          id: request.player.id,
          name: request.player.name,
        },
        gameId: request.gameId,
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
      if (!playerInGame(this._serverState, request.player, request.gameId)) {
        reject(new Error(StatusCode.PLAYER_ROOM_INVALID));
      }

      // [Server] Add chat message to the corresponding game
      const message: ChatResponse = {
        timestamp: DateTime.now(),
        playerId: request.player.id,
        message: request.message,
      };

      addChatMessage(this._serverState, request.gameId, message);

      resolve(message);
    });
  }

  startGame(request: StartGameRequest): Promise<StartGameResponse> {
    return new Promise((resolve, reject) => {
      // [Server] Validation (playerId + Secret, game exists? playerId equals creatorId,
      // playerCount in room == playerCount in ruleset) -> Errorfeedback
      if (!playerExists(this._serverState, request.player)) {
        reject(new Error(StatusCode.PLAYER_INVALID));
      }

      if (!gameExists(this._serverState, request.gameId)) {
        reject(new Error(StatusCode.GAME_NOT_EXISTS));
      }

      if (!isCreator(this._serverState, request.gameId, request.player)) {
        reject(new Error(StatusCode.GAME_CREATOR_INVALID));
      }

      if (!isPlayerCountValid(this._serverState, request.gameId)) {
        reject(new Error(StatusCode.PLAYER_COUNT_MATCH_INVALID));
      }

      // [Server] Create initial game state
      startGameState(this._serverState, request.gameId);

      const response: StartGameResponse = {
        status: StatusCode.OK,
        timestamp: DateTime.now(),
        gameId: request.gameId,
      }

      resolve(response);
    });
  }

  drawCard(
    request: DrawCardRequest
  ): Promise<[DrawCardResponse, UpdateGameBoardResponse]> {
    return new Promise((resolve, reject) => {
      // [Server] Validation (playerId + Secret, player is on move? -> Errorfeedback
      if (!playerExists(this._serverState, request.player)) {
        reject(new Error(StatusCode.PLAYER_INVALID));
      }

      if (!gameExists(this._serverState, request.gameId)) {
        reject(new Error(StatusCode.GAME_NOT_EXISTS));
      }

      if (!pileExists(this._serverState, request.gameId, request.pileId)) {
        reject(new Error(StatusCode.PILE_NOT_EXISTS));
      }

      if (!(this.getActivePlayer(request.gameId) === request.player.id)) {
        reject(new Error(StatusCode.NOT_ACTIVE_PLAYER));
      }

      // const card = drawCard(this._serverState, request.gameId, request.pileId);
      // const piles = getGameState(this._serverState, request.gameId).piles;

      // addCardToHand(this._serverState, request.gameId, request.player, card);

      // const drawCardResponse = {
      //   timestamp: DateTime.now(),
      //   card: card,
      // };

      // const updateGameBoardResponse = {
      //   timestamp: DateTime.now(),
      //   piles: toKeyValueArray(piles),
      // };

      // resolve([drawCardResponse, updateGameBoardResponse]);
    });
  }

  discardCard(request: DiscardCardRequest): Promise<UpdateGameBoardResponse> {
    return new Promise((resolve, reject) => {
      // [Server] Validation (playerId + Secret, player is on move? -> Errorfeedback
      if (!playerExists(this._serverState, request.player)) {
        reject(new Error(StatusCode.PLAYER_INVALID));
      }

      if (!gameExists(this._serverState, request.gameId)) {
        reject(new Error(StatusCode.GAME_NOT_EXISTS));
      }

      if (!(this.getActivePlayer(request.gameId) === request.player.id)) {
        reject(new Error(StatusCode.NOT_ACTIVE_PLAYER));
      }

      if (
        !isCardOwner(
          this._serverState,
          request.gameId,
          request.player,
          request.cardId
        )
      ) {
        reject(new Error(StatusCode.PLAYER_NOT_CARD_OWNER));
      }

      discardCard(
        this._serverState,
        request.gameId,
        request.player,
        request.cardId
      );

      nextPlayer(this._serverState, request.gameId);

      nextGameStep(this._serverState, request.gameId, GameStep.DRAW);

      const response: UpdateGameBoardResponse = {
        status: StatusCode.OK,
        timestamp: DateTime.now(),
        gameId: request.gameId,
      };

      resolve(response);
    });
  }

  getSocketId(playerId: string): string {
    return playerToSocketId(this._serverState, playerId);
  }

  getActivePlayer(gameId: string): string {
    return activePlayerInGame(this._serverState, gameId);
  }

  getPlayerIdListFromGame(gameId: string): string[] {
    return getPlayerIdList(this._serverState, gameId);
  }
}
