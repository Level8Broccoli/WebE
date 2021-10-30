import { toKeyValueArray } from "../../shared/helper/HelperService";
import {
  Card,
  CardType,
  Color, Game, GameState, GameStatus, NumberCard, PublicGameTransfer,
  PublicGameTransferState,
  SpecialCard
} from "../../shared/model/Game";
import { PrivatePlayer } from "../../shared/model/Player";
import { ServerState } from "../../shared/model/ServerState";

const HAND_SIZE_START = 10;
const DRAW_PILE = "drawPile";

function initialCardSet(): Card[] {
  const cardset: Card[] = [];
  // 1 - 15 for all colors
  for (const key in Color) {
    for (let index = 1; index <= 15; index++) {
      const card: NumberCard = {
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

function createHand(cardset: Card[]): Card[] {
  const cards = [];

  for (let index = 0; index < 10; index++) {
    const card = cardset.pop();
    if (card !== undefined) {
      cards.push(card);
    }
  }

  return cards;
}

export function initGameState(): GameState {
  // Init state with a full randomly sorted draw pile
  return {
    activePlayerId: "",
    hands: new Map(),
    piles: new Map().set(
      DRAW_PILE,
      initialCardSet().sort((a, b) => 0.5 - Math.random())
    ),
  };
}

export function startGameState(
  serverState: ServerState,
  gameId: string
): void {
  const game = serverState.games.find(g => g.id === gameId)!;

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
  serverState: ServerState,
  gameId: string
): Game | undefined {
  return serverState.games.find((g) => g.id === gameId);
}

export function getGameState(
  serverState: ServerState,
  gameId: string
): GameState {
  return serverState.games.find((g) => g.id === gameId)!.state!;
}

export function pileExists(
  serverState: ServerState,
  gameId: string,
  pileId: string
): boolean {
  return (
    serverState.games
      .find((g) => g.id === gameId)!
      .state!.piles.get(pileId) !== undefined
  );
}

export function isCardOwner(
  serverState: ServerState,
  gameId: string,
  player: PrivatePlayer,
  card: Card
): boolean {
  return (
    serverState.games
      .find((g) => g.id === gameId)!
      .state!.hands.get(player.id)!
      .find((c) => c === card) !== undefined
  );
}

export function discardCard(
  serverState: ServerState,
  gameId: string,
  player: PrivatePlayer,
  card: Card
) {
  // remove the card from the hand
  const hands = serverState.games.find((g) => g.id === gameId)!.state!.hands;
  hands.set(
    player.id,
    hands.get(player.id)!.filter((c) => c === card)
  );
  // then add it to the players discard pile
  const pile = serverState.games
    .find((g) => g.id === gameId)!
    .state!.piles!.get(player.id);
  pile!.push(card);
  serverState.games
    .find((g) => g.id === gameId)!
    .state!.piles!.set(player.id, pile!);
}

function createPlayerStartHand(game: Game, playerId: string, numberOfCards: number) {
  for (let i = 0; i < numberOfCards; i++) {
    drawCard(game, DRAW_PILE, playerId);
  }
}

function createEmptyDiscardPile(game: Game, playerId: string) {
  game.state.piles.set(playerId, []);
}

function setActivePlayer(game: Game, playerId: string) {
  game.state.activePlayerId = playerId;
}

function drawCard(game: Game, from: string, to: string) {
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

export function getAllGames(
  serverState: ServerState,
  playerId?: string
): PublicGameTransfer[] {
  return serverState.games.map(({ id, creatorId, players, config, status, chat, state: { activePlayerId, hands, piles } }) => {
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
      hands: toKeyValueArray(newHands),
      piles: toKeyValueArray(newPiles)
    }
    const newPublicGame: PublicGameTransfer = { id, creatorId, players, config, status, chat, state: newPublicGameState };
    return newPublicGame;
  });
}

export function getPlayerIdList(serverState: ServerState, gameId: string): string[] {
  return serverState.games.find(g => g.id === gameId)!.players;
}
