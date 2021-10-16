import { FullPlayer, PrivatePlayer } from "../../shared/model/Player";
import { Game, SimpleGame } from "../../shared/model/Game";
import { ServerState } from "../../shared/model/ServerState";
import { ChatMessage } from "../../shared/model/Chat";

export function registerPlayer(serverState: ServerState, player: FullPlayer) {
  serverState.players.push(player);
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
  game: SimpleGame,
  player: PrivatePlayer
): boolean {
  // Find game with correct gameId and creatorId pair
  const found = serverState.games.find(
    (g) => g.id === game.id && g.creatorId === player.id
  );

  return found !== undefined;
}

export function deleteGame(serverState: ServerState, game: SimpleGame) {
  serverState.games = serverState.games.filter((g) => g.id !== game.id);
}

export function gameExists(
  serverState: ServerState,
  game: SimpleGame
): boolean {
  const found = serverState.games.find((g) => g.id === game.id);

  return found !== undefined;
}

export function freeSpaceInGame(
  serverState: ServerState,
  game: SimpleGame
): boolean {
  const g = serverState.games.find((g) => g.id === game.id);
  if (g === undefined) {
    return false;
  }
  return g.players.length < g.config.maxPlayerCount;
}

export function joinGame(
  serverState: ServerState,
  player: PrivatePlayer,
  game: SimpleGame
) {
  serverState.games.find((g) => g.id === game.id)?.players.push(player.id);
}

export function leaveGame(
  serverState: ServerState,
  player: PrivatePlayer,
  game: SimpleGame
) {
  const g = serverState.games.find((g) => g.id === game.id);
  if (g !== undefined) {
    g.players = g.players.filter((id) => id !== player.id);
  }
}

export function playerInGame(
  serverState: ServerState,
  player: PrivatePlayer,
  game: SimpleGame
): boolean {
  // To be simplified
  const g = serverState.games.find((g) => g.id === game.id);
  if (g !== undefined) {
    const p = g.players.find((id) => id === player.id);

    return p !== undefined ? true : false;
  } else {
    return false;
  }
}

export function addChatMessage(
  serverState: ServerState,
  game: SimpleGame,
  chatMessage: ChatMessage
) {
  serverState.games.find((g) => g.id === game.id)?.chat?.push(chatMessage);
}

export function checkPlayerCount(
  serverState: ServerState,
  game: SimpleGame
): boolean {
  const g = serverState.games.find((g) => g.id === game.id);

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
