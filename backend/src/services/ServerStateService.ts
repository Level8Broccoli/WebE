import { PrivatePlayer } from "../model/Player";
import { Game, SimpleGame } from "../model/Game";
import { ServerState } from "../model/ServerState";

export function registerPlayer(
  serverState: ServerState,
  player: PrivatePlayer
) {
  serverState.players.push(player);
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

  return found !== undefined ? true : false;
}

export function canGameBeDeleted(
  serverState: ServerState,
  game: SimpleGame,
  player: PrivatePlayer
): boolean {
  // Find game with correct gameId and creatorId pair
  const found = serverState.games.find(
    (g) => g.id === game.id && g.creatorId === player.id
  );

  return found !== undefined ? true : false;
}

export function deleteGame(serverState: ServerState, game: SimpleGame) {
  serverState.games = serverState.games.filter((g) => g.id !== game.id);
}

export function gameExists(
  serverState: ServerState,
  game: SimpleGame
): boolean {
  const found = serverState.games.find((g) => g.id === game.id);

  return found !== undefined ? true : false;
}

export function isFreePlaceInGameAvailabe(
  serverState: ServerState,
  game: SimpleGame
): boolean {
  const g = serverState.games.find((g) => g.id === game.id);
  if (g === undefined) {
    return false;
  }
  return g.players.length < g.gameConfig.maxPlayerCountForGame ? true : false;
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
