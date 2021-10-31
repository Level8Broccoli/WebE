import { toKeyValueArray } from "../../shared/helper/HelperService";
import {
  Card,
  CardType,
  Color, Game, GameState, GameStatus, GameStep, NumberCard, PublicGameTransfer,
  PublicGameTransferState,
  SpecialCard
} from "../../shared/model/Game";
import { PrivatePlayer } from "../../shared/model/Player";
import { ServerState } from "../../shared/model/ServerState";
import { getUUID } from "./TokenGeneratorService";

const HAND_SIZE_START = 10;
const DRAW_PILE = "drawPile";

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

  // 5 times joker -- use later
  // for (let index = 0; index < 5; index++) {
  //   const card: SpecialCard = {
  //     value: 0,
  //     type: CardType.JOKER,
  //   };
  //   cardset.push(card);
  // }

  // 3 times skip -- use later
  // for (let index = 0; index < 3; index++) {
  //   const card: SpecialCard = {
  //     value: 0,
  //     type: CardType.SKIP,
  //   };
  //   cardset.push(card);
  // }

  return cardset;
}

export function initGameState(): GameState {
  // Init state with a full randomly sorted draw pile
  return {
    activePlayerId: "",
    currentStep: GameStep.DISCARD,
    hands: new Map(),
    piles: new Map().set(
      DRAW_PILE,
      initialCardSet().sort((a, b) => 0.5 - Math.random())
    ),
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

  setActivePlayer(game, playerIdList[0]);
}

// export function drawCard(
//   serverState: ServerState,
//   gameId: string,
//   pileId: string
// ): Card {
//   if (pileId === "drawPile") {
//     // if length from drawPile is 0 take all discardPiles,
//     const state = serverState.games.find((g) => g.id === gameId)!.state!;
//     if (state.piles.get(pileId)!.length === 0) {
//       const tempCards: Card[] = [];
//       state.piles.forEach((cards, key) => {
//         if (!(key === pileId)) {
//           tempCards.concat(cards!);
//           state.piles.delete(key);
//         }
//       });
//       // shuffle the array again and place all cards in the drawPile
//       state.piles.set(
//         pileId,
//         tempCards.sort((a, b) => 0.5 - Math.random())
//       );
//     }
//   }

//   return serverState.games
//     .find((g) => g.id === gameId)!
//     .state!.piles.get(pileId)!
//     .pop()!;
// }

export function addCardToHand(
  serverState: ServerState,
  gameId: string,
  player: PrivatePlayer,
  card: Card
) {
  const state = serverState.games.find((g) => g.id === gameId)!.state!;
  state.hands.set(player.id, state.hands.get(player.id)!.concat(card));
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
  return (
    game.state.piles.get(pileId) !== undefined
  );
}

export function getPile(game: Game, pileId: string): Card[] {
  const pile = game.state.piles.get(pileId);
  if (typeof pile === "undefined") {
    throw new Error("Pile does not exists!");
  }
  return pile;
}

export function isCardOwner(
  game: Game,
  playerId: string,
  cardId: string
): boolean {
  return game.state.hands.get(playerId)!
    .find((c) => c.id === cardId) !== undefined

}

export function discardCard(
  game: Game,
  playerId: string,
  cardId: string
) {
  // remove the card from the hand
  const hands = game!.state.hands;
  const card = hands.get(playerId)!.find(c => c.id === cardId);
  hands.set(
    playerId,
    hands.get(playerId)!.filter((c) => c.id !== cardId)
  );
  // then add it to the players discard pile
  const pile = game!.state.piles.get(playerId);
  pile!.unshift(card!);
}

function createPlayerStartHand(game: Game, playerId: string, numberOfCards: number) {
  for (let i = 0; i < numberOfCards; i++) {
    drawCardFromPile(game, DRAW_PILE, playerId);
  }
}

function createEmptyDiscardPile(game: Game, playerId: string) {
  game.state.piles.set(playerId, []);
}

function setActivePlayer(game: Game, playerId: string) {
  game.state.activePlayerId = playerId;
}

export function drawCardFromPile(game: Game, from: string, to: string) {
  const fromPile = game.state.piles.get(from);
  if (typeof fromPile === "undefined") {
    throw new Error("This pile does not exist.");
  }
  const nextCard = fromPile.shift();
  if (typeof nextCard === "undefined") {
    throw new Error("This pile is empty.");
  }
  if (typeof game.state.hands.get(to) === "undefined") {
    game.state.hands.set(to, []);
  }
  const toHand = game.state.hands.get(to)!;
  toHand.push(nextCard);
}

export function getAllGamesForPlayer(
  gameList: Game[],
  playerId?: string
): PublicGameTransfer[] {
  return gameList.map(({ id, creatorId, players, config, status, chat, state: { activePlayerId, currentStep, hands, piles } }) => {
    const handKeys = Array.from(hands.keys());
    const newHands = new Map<string, Card[] | number>();
    handKeys.forEach(key => {
      // only show the cards on the requesting player
      // alternativally show the number of cards on all the other players
      if (key === playerId) {
        newHands.set(key, hands.get(key)!);
      } else {
        newHands.set(key, hands.get(key)!.length);
      }
    });

    const pileKeys = Array.from(piles.keys());
    const newPiles = new Map<string, Card[] | number>();
    pileKeys.forEach(key => {
      // only show the cards on the requesting player
      // alternativally show the number of cards on all the other players
      if (key === DRAW_PILE) {
        newPiles.set(key, piles.get(key)!.length);
      } else {
        newPiles.set(key, piles.get(key)!);
      }
    });

    const newPublicGameState: PublicGameTransferState = {
      activePlayerId,
      currentStep,
      hands: toKeyValueArray(newHands),
      piles: toKeyValueArray(newPiles)
    }
    const newPublicGame: PublicGameTransfer = { id, creatorId, players, config, status, chat, state: newPublicGameState };
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
