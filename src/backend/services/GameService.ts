import {
  Card,
  CardRow,
  CardRowType,
  CardStack,
  CardStackOpen,
  CardType,
  Color,
  DRAW_PILE_ID,
  Game,
  GameLevel,
  GameState,
  GameStatus,
  GameStep,
  LevelSystem,
  NumberCard,
  PlayerLevel
} from "../../shared/model/Game";
import { ServerState } from "../../shared/model/ServerState";
import { getUUID } from "./TokenGeneratorService";

const HAND_SIZE_START = 10;

export function initialCardSet(): Card[] {
  const cardset: Card[] = [];
  // 1 - 15 for all colors
  for (const key in Color) {
    for (let index = 1; index <= 15; index++) {
      const card: NumberCard = {
        id: getUUID(),
        value: index,
        color: key,
        type: CardType.NUMBER,
      };
      cardset.push(card);
    }
  }

  return cardset;
}

export function initGameState(): GameState {
  // Init state with a full randomly sorted draw pile
  return {
    activePlayerId: "",
    currentStep: GameStep.DRAW,
    playerLevels: [],
    hands: [],
    piles: [],
    board: []
  };
}

export function startGameState(
  game: Game
) {
  game.status = GameStatus.IN_PROGRESS;

  const playerIdList = game.players;

  for (const playerId of playerIdList) {
    createPlayerStartHand(game, playerId, HAND_SIZE_START);
  }

  for (const playerId of playerIdList) {
    createEmptyDiscardPile(game, playerId);
  }

  setupGameLevels(game);

  setActivePlayer(game, playerIdList[0]);

  revealOneCardToDiscard(game.state.piles, playerIdList[playerIdList.length - 1])
}

export function getGame(
  gameList: Game[],
  gameId: string
): Game {
  const game = gameList.find(g => g.id === gameId);
  if (typeof game === "undefined") {
    throw new Error("Game not Found!");
  }
  return game;
}

export function getGameState(
  serverState: ServerState,
  gameId: string
): GameState {
  return serverState.games.find((g) => g.id === gameId)!.state!;
}

export function pileExists(
  game: Game,
  pileId: string
): boolean {
  return !!game.state.piles.find(p => p.id === pileId);
}

export function handExists(
  game: Game,
  playerId: string
): boolean {
  return !!game.state.hands.find(p => p.id === playerId);
}

export function getPile(game: Game, pileId: string): string[] {
  const pile = game.state.piles.find(p => p.id === pileId);
  if (typeof pile === "undefined") {
    throw new Error("Pile does not exists!");
  }
  return (pile as CardStackOpen).cardIds;
}
export function getHand(game: Game, playerId: string): string[] {
  const hand = game.state.hands.find(h => h.id === playerId);
  if (typeof hand === "undefined") {
    throw new Error("Pile does not exists!");
  }
  return (hand as CardStackOpen).cardIds;
}

export function isCardOwner(
  game: Game,
  playerId: string,
  cardId: string
): boolean {
  const hand = game.state.hands.find(h => h.id === playerId);
  if (typeof hand === "undefined") {
    throw new Error("Hand does not exists!");
  }
  return !!((hand as CardStackOpen).cardIds.find((id) => id === cardId))
}

export function discardCard(
  game: Game,
  playerId: string,
  cardId: string
) {
  // remove the card from the hand
  const state = game.state;
  const card = (state.hands.find(h => h.id === playerId) as CardStackOpen).cardIds.find(id => id === cardId);
  state.hands = state.hands.map(h => {
    return {
      id: h.id,
      cardIds: (h as CardStackOpen).cardIds.filter(id => id !== cardId)
    }
  })
  // then add it to the players discard pile
  const pile = getPile(game, playerId);
  pile.unshift(card!);
}

function createPlayerStartHand(game: Game, playerId: string, numberOfCards: number) {
  for (let i = 0; i < numberOfCards; i++) {
    drawCardFromPile(game, DRAW_PILE_ID
      , playerId);
  }
}

function createEmptyDiscardPile(game: Game, playerId: string) {
  const pile: CardStackOpen = {
    id: playerId,
    cardIds: []
  };
  game.state.piles.push(pile);
}

function setActivePlayer(game: Game, playerId: string) {
  game.state.activePlayerId = playerId;
}

function revealOneCardToDiscard(cardPiles: CardStack[], playerId: string) {
  const drawPile = cardPiles.find(p => p.id === DRAW_PILE_ID);
  if (typeof drawPile === "undefined" || "count" in drawPile) {
    throw new Error("Draw Pile not found!");
  }
  const firstCard = drawPile.cardIds[0];

  drawPile.cardIds = drawPile.cardIds.filter(id => id !== firstCard);
  const playerDiscardPile = cardPiles.find(p => p.id === playerId);
  if (typeof playerDiscardPile === "undefined" || "count" in playerDiscardPile) {
    throw new Error("Player Pile not found!");
  }
  playerDiscardPile.cardIds = [...playerDiscardPile.cardIds, firstCard];
}

function setupGameLevels(game: Game) {
  const { levelCount, levelSystem } = game.config;
  const levels = [GameLevel.LVL1, GameLevel.LVL2, GameLevel.LVL3, GameLevel.LVL4, GameLevel.LVL5, GameLevel.LVL6, GameLevel.LVL7, GameLevel.LVL8];
  if (levelSystem === LevelSystem.RANDOM) {
    levels.sort((a, b) => 0.5 - Math.random());
  }
  game.levels = levels.slice(0, levelCount);

  for (const playerId of game.players) {
    game.state.playerLevels.push({
      playerId,
      currentLevelIndex: 0,
      hasAchievedLevel: false,
    });
  }
}

export function drawCardFromPile(game: Game, from: string, to: string) {
  const fromPile = getPile(game, from);
  const nextCard = fromPile.shift();
  if (typeof nextCard === "undefined") {
    throw new Error("This pile is empty.");
  }
  if (!(handExists(game, to))) {
    const newHand: CardStackOpen = {
      id: to,
      cardIds: []
    }
    game.state.hands.push(newHand);
  }
  const toHand = getHand(game, to);
  toHand.push(nextCard);
}

export function getAllGamesForPlayer(
  gameList: Game[],
  playerId?: string
): Game[] {
  return gameList.map(({ id, creatorId, players, config, status, chat, levels, cards, state: { activePlayerId, currentStep, playerLevels, hands, piles, board } }) => {
    const newHands = (hands as CardStackOpen[]).map(({ id, cardIds }) => {
      // only show the cards on the requesting player
      // alternativally show the number of cards on all the other players
      if (id === playerId) {
        return {
          id,
          cardIds
        }
      }
      return {
        id,
        count: cardIds.length
      }
    });

    const newPiles = (piles as CardStackOpen[]).map(({ id, cardIds }) => {
      // only show the cards on the requesting player
      // alternativally show the number of cards on all the other players
      if (id === DRAW_PILE_ID
      ) {
        return {
          id,
          count: cardIds.length
        }
      }
      return {
        id,
        cardIds: cardIds[0] ? [cardIds[0]] : cardIds // hack: only send the top card of each discard pile, because I couldn't figure out how VueJS handles list manipulation correctly
      }
    });

    const newPublicGameState: GameState = {
      activePlayerId,
      currentStep,
      playerLevels,
      hands: newHands,
      piles: newPiles,
      board
    }
    const newPublicGame: Game = { id, creatorId, players, config, status, levels, cards, chat, state: newPublicGameState };
    return newPublicGame;
  });
}

export function moveCardsFromHandToBoard(game: Game, playerId: string, cardRows: CardRow[]) {
  const sortedCardRows = cardRows.map(({ type, cardIds }) => {
    if (type === CardRowType.STREET) {
      const cards: Card[] = [];
      for (const cardId of cardIds) {
        const card = getCardById(game.cards, cardId);
        cards.push(card);
      }
      cards.sort((a, b) => a.value - b.value);
      return { type, cardIds: cards.map(c => c.id) };
    }
    return { type, cardIds };
  });
  game.state.board.push(...sortedCardRows);
  game.state.hands = game.state.hands.map(h => {
    if (h.id === playerId) {
      const cardsToRemove: string[][] = [];
      cardRows.forEach(cr => cardsToRemove.push(cr.cardIds));

      return {
        cardIds: (h as CardStackOpen).cardIds.filter(id => !(cardsToRemove.flat().includes(id))),
        id: h.id
      }
    }
    return h
  })
}


export function nextPlayer(game: Game) {
  const activePlayerId = game.state.activePlayerId;
  const playerIdList = game.players;
  const numberOfPlayers = game.players.length;
  const activePlayerIndex = playerIdList.indexOf(activePlayerId);
  const nextPlayerIndex = (activePlayerIndex + 1) % numberOfPlayers;

  game.state.activePlayerId = playerIdList[nextPlayerIndex];
}

export function nextGameStep(game: Game, gameStep: GameStep) {
  game.state.currentStep = gameStep;
}

export function markPlayerLevelFulfilled(gameState: GameState, playerId: string) {
  const player = gameState.playerLevels.find(pl => pl.playerId === playerId);
  if (typeof player === "undefined") {
    throw new Error("Player not found!");
  }
  player.hasAchievedLevel = true;
}
function getCardById(cards: Card[], cardId: string): Card {
  const card = cards.find(c => c.id === cardId);
  if (typeof card === "undefined") {
    throw new Error("Card not found!");
  }
  return card;
}

export function hasAlreadyFulfilledLevel(playerLevels: PlayerLevel[], playerId: string): boolean {
  const playerLevel = playerLevels.find(pl => pl.playerId === playerId);
  if (typeof playerLevel === "undefined") {
    throw new Error("Player not found!");
  }
  return playerLevel.hasAchievedLevel;
}
