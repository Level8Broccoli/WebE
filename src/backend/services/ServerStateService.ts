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

export function removePlayerFromPlayerList(playerIdList: FullPlayer[], playerId: string) {
  playerIdList = playerIdList.filter(p => p.id !== playerId);
}

export function registerExistingPlayer(playerIdList: FullPlayer[], player: PrivatePlayer, socketId: string) {
  playerIdList = playerIdList.map((p) =>
    p.id === player.id && p.secret === player.secret
      ? { ...p, socketId: socketId }
      : p
  );
}

export function editPlayerName(
  playerIdList: FullPlayer[],
  player: PrivatePlayer
) {
  playerIdList = playerIdList.map((p) =>
    p.id === player.id && p.secret === player.secret
      ? { ...p, name: player.name }
      : p
  );
}

export function createGame(gameList: Game[], game: Game) {
  gameList.push(game);
}

export function authenticatePlayer(
  playerList: FullPlayer[],
  player: PrivatePlayer
): boolean {
  // Find player with correct id and secret pair
  return !!playerList.find(
    (p) => p.id === player.id && p.secret === player.secret
  );
}

export function isCreator(
  game: Game,
  playerId: string
): boolean {
  // Find game with correct gameId and creatorId pair
  return game.creatorId === playerId
}

export function deleteGame(gameList: Game[], gameId: string) {
  gameList = gameList.filter((g) => g.id !== gameId);
}

export function gameExists(
  gameList: Game[],
  gameId: string
): boolean {
  return gameList.find((g) => g.id === gameId) !== undefined;
}

export function freeSpaceInGame(
  game: Game,
): boolean {
  return game.players.length < game.config.maxPlayerCount;
}

export function joinGame(
  game: Game,
  player: PrivatePlayer,
) {
  game.players.push(player.id);
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

export function isPlayerCountValid(
  game: Game
): boolean {
  return game.players.length <= game.config.maxPlayerCount;
}

export function playerToSocketId(
  playerList: FullPlayer[],
  playerId: string
): string {
  const player = playerList.find((p) => p.id === playerId);
  if (typeof player === "undefined") {
    throw new Error("Player not found!");
  }
  return player.socketId;
}

export function getActiveGameId(games: Game[], playerId: string): string {
  const game = games.find(g => g.players.includes(playerId));
  if (typeof game === "undefined") {
    return "";
  }
  return game.id;
}

export function getAllRegisteredPlayers(
  playerList: FullPlayer[]
): PublicPlayer[] {
  return playerList.map(({ id, name }) => {
    return { id, name }
  });
}
