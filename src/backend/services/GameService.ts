import {
  Card,
  CardType,
  Color,
  NumberCard,
  SpecialCard,
  State
} from "../../shared/model/Game";
import { PrivatePlayer } from "../../shared/model/Player";
import { ServerState } from "../../shared/model/ServerState";

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

  // 5 times joker
  for (let index = 0; index < 5; index++) {
    const card: SpecialCard = {
      value: 0,
      type: CardType.JOKER,
    };
    cardset.push(card);
  }

  // 3 times skip
  for (let index = 0; index < 3; index++) {
    const card: SpecialCard = {
      value: 0,
      type: CardType.SKIP,
    };
    cardset.push(card);
  }

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

export function initGameState(
  serverState: ServerState,
  gameId: string
): State {
  const g = serverState.games.find((g) => g.id === gameId);

  if (g !== undefined) {
    // Init state with a full randomly sorted draw pile and the last joined person as beginner
    g.state = {
      activePlayerId: g.players[g.players.length - 1],
      hands: new Map(),
      piles: new Map().set(
        "drawPile",
        initialCardSet().sort((a, b) => 0.5 - Math.random())
      ),
    };

    // Create for every player a hand with 10 cards from the draw pile
    for (const playerId of g.players) {
      g.state.hands.set(playerId, createHand(g.state.piles.get("drawPile")!));
    }
  }

  return g!.state!;
}

export function drawCard(
  serverState: ServerState,
  gameId: string,
  pileId: string
): Card {
  if (pileId === "drawPile") {
    // if length from drawPile is 0 take all discardPiles,
    const state = serverState.games.find((g) => g.id === gameId)!.state!;
    if (state.piles.get(pileId)!.length === 0) {
      const tempCards: Card[] = [];
      state.piles.forEach((cards, key) => {
        if (!(key === pileId)) {
          tempCards.concat(cards!);
          state.piles.delete(key);
        }
      });
      // shuffle the array again and place all cards in the drawPile
      state.piles.set(
        pileId,
        tempCards.sort((a, b) => 0.5 - Math.random())
      );
    }
  }

  return serverState.games
    .find((g) => g.id === gameId)!
    .state!.piles.get(pileId)!
    .pop()!;
}

export function addCardToHand(
  serverState: ServerState,
  gameId: string,
  player: PrivatePlayer,
  card: Card
) {
  const state = serverState.games.find((g) => g.id === gameId)!.state!;
  state.hands.set(player.id, state.hands.get(player.id)!.concat(card));
}

export function getGameState(
  serverState: ServerState,
  gameId: string
): State {
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
