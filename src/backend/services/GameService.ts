import {
  Card,
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
  NumberCard
} from "../../shared/model/Game";
import { ServerState } from "../../shared/model/ServerState";
import { getUUID } from "./TokenGeneratorService";

const HAND_SIZE_START = 10;

function initialCardSet(): Card[] {
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
    currentStep: GameStep.DISCARD,
    playerLevels: [],
    hands: [],
    piles: [{
      id: DRAW_PILE_ID,
      cards: initialCardSet().sort((a, b) => 0.5 - Math.random())
    }]
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

export function getPile(game: Game, pileId: string): Card[] {
  const pile = game.state.piles.find(p => p.id === pileId);
  if (typeof pile === "undefined") {
    throw new Error("Pile does not exists!");
  }
  return (pile as CardStackOpen).cards;
}
export function getHand(game: Game, playerId: string): Card[] {
  const hand = game.state.hands.find(h => h.id === playerId);
  if (typeof hand === "undefined") {
    throw new Error("Pile does not exists!");
  }
  return (hand as CardStackOpen).cards;
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
  return !!((hand as CardStackOpen).cards.find((c) => c.id === cardId))
}

export function discardCard(
  game: Game,
  playerId: string,
  cardId: string
) {
  // remove the card from the hand
  const state = game.state;
  const card = (state.hands.find(h => h.id === playerId) as CardStackOpen).cards.find(c => c.id === cardId);
  state.hands = state.hands.map(h => {
    return {
      id: h.id,
      cards: (h as CardStackOpen).cards.filter(c => c.id !== cardId)
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
    cards: []
  };
  game.state.piles.push(pile);
}

function setActivePlayer(game: Game, playerId: string) {
  game.state.activePlayerId = playerId;
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
      cards: []
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
  return gameList.map(({ id, creatorId, players, config, status, chat, levels, state: { activePlayerId, currentStep, playerLevels, hands, piles } }) => {
    const newHands = (hands as CardStackOpen[]).map(({ id, cards }) => {
      // only show the cards on the requesting player
      // alternativally show the number of cards on all the other players
      if (id === playerId) {
        return {
          id,
          cards
        }
      }
      return {
        id,
        count: cards.length
      }
    });

    const newPiles = (piles as CardStackOpen[]).map(({ id, cards }) => {
      // only show the cards on the requesting player
      // alternativally show the number of cards on all the other players
      if (id === DRAW_PILE_ID
      ) {
        return {
          id,
          count: cards.length
        }
      }
      return {
        id,
        cards: cards[0] ? [cards[0]] : cards // hack: only send the top card of each discard pile, because I couldn't figure out how VueJS handles list manipulation correctly
      }
    });

    const newPublicGameState: GameState = {
      activePlayerId,
      currentStep,
      playerLevels,
      hands: newHands,
      piles: newPiles
    }
    const newPublicGame: Game = { id, creatorId, players, config, status, levels, chat, state: newPublicGameState };
    return newPublicGame;
  });
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
