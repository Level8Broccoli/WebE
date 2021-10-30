import { ChatMessage } from "../../shared/model/Chat";
import { Game } from "../../shared/model/Game";
import { FullPlayer, PrivatePlayer, PublicPlayer } from "../../shared/model/Player";
import { ServerState } from "../../shared/model/ServerState";

export function registerPlayer(serverState: ServerState, player: FullPlayer) {
  serverState.players.push(player);
}

export function deleteOwnGame(serverState: ServerState, playerId: string) {
  serverState.games = serverState.games.filter(g => g.creatorId !== playerId);
}

export function removePlayerFromJoinedGame(serverState: ServerState, playerId: string) {
  serverState.games.map(g => g.players = g.players.filter(p => p !== playerId));
}

export function removePlayerFromPlayerList(serverState: ServerState, playerId: string) {
  serverState.players = serverState.players.filter(p => p.id !== playerId);
}

export function registerExistingPlayer(serverState: ServerState, player: PrivatePlayer, socketId: string) {
  serverState.players = serverState.players.map((p) =>
    p.id === player.id && p.secret === player.secret
      ? { ...p, socketId: socketId }
      : p
  );
}

export function editPlayerName(
  serverState: ServerState,
  player: PrivatePlayer
) {
  serverState.players = serverState.players.map((p) =>
    p.id === player.id && p.secret === player.secret
      ? { ...p, name: player.name }
      : p
  );
}

export function createGame(serverState: ServerState, game: Game) {
  serverState.games.push(game);
}

export function playerExists(
  serverState: ServerState,
  player: PrivatePlayer
): boolean {
  // Find player with correct id and secret pair
  const found = serverState.players.find(
    (p) => p.id === player.id && p.secret === player.secret
  );

  return found !== undefined;
}

export function isCreator(
  serverState: ServerState,
  gameId: string,
  player: PrivatePlayer
): boolean {
  // Find game with correct gameId and creatorId pair
  const found = serverState.games.find(
    (g) => g.id === gameId && g.creatorId === player.id
  );

  return found !== undefined;
}

export function deleteGame(serverState: ServerState, gameId: string) {
  serverState.games = serverState.games.filter((g) => g.id !== gameId);
}

export function gameExists(
  serverState: ServerState,
  gameId: string
): boolean {
  return serverState.games.find((g) => g.id === gameId) !== undefined;
}

export function freeSpaceInGame(
  serverState: ServerState,
  gameId: string
): boolean {
  const g = serverState.games.find((g) => g.id === gameId);
  if (g === undefined) {
    return false;
  }
  return g.players.length < g.config.maxPlayerCount;
}

export function joinGame(
  serverState: ServerState,
  player: PrivatePlayer,
  gameId: string
) {
  serverState.games.find((g) => g.id === gameId)?.players.push(player.id);
}

export function leaveGame(
  serverState: ServerState,
  player: PrivatePlayer,
  gameId: string
) {
  const g = serverState.games.find((g) => g.id === gameId);
  if (g !== undefined) {
    g.players = g.players.filter((id) => id !== player.id);
  }
}

export function playerInGame(
  serverState: ServerState,
  player: PrivatePlayer,
  gameId: string
): boolean {
  // To be simplified
  const g = serverState.games.find((g) => g.id === gameId);
  if (g !== undefined) {
    const p = g.players.find((id) => id === player.id);

    return p !== undefined ? true : false;
  } else {
    return false;
  }
}

export function addChatMessage(
  serverState: ServerState,
  gameId: string,
  chatMessage: ChatMessage
) {
  serverState.games.find((g) => g.id === gameId)?.chat?.push(chatMessage);
}

export function checkPlayerCount(
  serverState: ServerState,
  gameId: string
): boolean {
  const g = serverState.games.find((g) => g.id === gameId);

  return g !== undefined
    ? g.players.length === g.config.maxPlayerCount
      ? true
      : false
    : false;
}

export function playerToSocketId(
  serverState: ServerState,
  playerId: string
): string {
  const player = serverState.players.find((p) => p.id === playerId);
  return player!.socketId;
}

export function activePlayerInGame(
  serverState: ServerState,
  gameId: string
): string {
  return serverState.games.find((g) => g.id === gameId)!.state!.activePlayerId;
}

export function getActiveGame(games: Game[], playerId: string): undefined | Game {
  return games.find(g => g.players.includes(playerId));
}

export function getAllRegisteredPlayers(
  serverState: ServerState
): PublicPlayer[] {
  return serverState.players.map(({ id, name }) => {
    return { id, name }
  });
}

export function getAllGames(
  serverState: ServerState
): Game[] {
  return serverState.games;
}
