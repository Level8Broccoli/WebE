import { ChatMessage } from "../../shared/model/Chat";
import { CardRow, CardRowRequest, CardRowType, DRAW_PILE_ID, Game, GameRules, GameState } from "../../shared/model/Game";
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

export function registerExistingPlayer(playerIdList: FullPlayer[], player: PrivatePlayer, newSocketId: string): FullPlayer[] {
  return playerIdList.map(({ id, name, secret, socketId }) => {
    if (id === player.id && secret === player.secret) {
      return { id, name, secret, socketId: newSocketId };
    }
    else {
      return { id, name, secret, socketId };
    }
  }
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

export function createGame(gameList: Game[], game: Game) {
  gameList.push(game);
}
export function fillDrawPile(game: Game) {
  const cards = game.cards;
  game.state.piles.push({
    id: DRAW_PILE_ID,
    cardIds: cards.sort((a, b) => 0.5 - Math.random()).map(c => c.id)
  })
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

export function isLevelValid(
  game: Game,
  playerId: string,
  cardRows: CardRowRequest[]
): boolean {
  const playerLevel = game.state.playerLevels.find(l => l.playerId === playerId)?.currentLevelIndex;
  if (typeof playerLevel === 'undefined') {
    throw new Error("Player not found!");
  }
  const allCards = game.cards;
  const gameRules = GameRules[playerLevel];
  if (gameRules.length !== cardRows.length) {
    return false;
  }
  for (let i = 0; i < gameRules.length; i++) {
    const rulePart = gameRules[i];
    const cardIds = cardRows[i].cardIds;
    if (cardIds.length !== rulePart.count) {
      return false;
    }
    if (rulePart.type !== cardRows[i].type) {
      return false;
    }
    if (rulePart.type === CardRowType.STREET) {
      const cardValues: number[] = [];
      for (const cardId of cardIds) {
        const cardValue = allCards.find(c => c.id === cardId)?.value;
        if (typeof cardValue === "undefined") {
          return false;
        }
        cardValues.push(cardValue);
      }
      cardValues.sort((a, b) => a - b);
      for (let i = 0; i < cardValues.length - 1; i++) {
        const curr = cardValues[i];
        const next = cardValues[i + 1];
        if (curr + 1 !== next) {
          return false;
        }
      }
    }
    if (rulePart.type === CardRowType.SAME_NUMBER) {
      const cardValues: number[] = [];
      for (const cardId of cardIds) {
        const cardValue = allCards.find(c => c.id === cardId)?.value;
        if (typeof cardValue === "undefined") {
          return false;
        }
        cardValues.push(cardValue);
      }
      for (let i = 0; i < cardValues.length - 1; i++) {
        const curr = cardValues[i];
        const next = cardValues[i + 1];
        if (curr !== next) {
          return false;
        }
      }
    }
    if (rulePart.type === CardRowType.SAME_COLOR) {
      const cardColors: string[] = [];
      for (const cardId of cardIds) {
        const cardValue = allCards.find(c => c.id === cardId)?.color;
        if (typeof cardValue === "undefined") {
          return false;
        }
        cardColors.push(cardValue);
      }
      for (let i = 0; i < cardColors.length - 1; i++) {
        const curr = cardColors[i];
        const next = cardColors[i + 1];
        if (curr !== next) {
          return false;
        }
        if (curr === "NONE") {
          return false;
        }
      }
    }
  }
  return true;
}
