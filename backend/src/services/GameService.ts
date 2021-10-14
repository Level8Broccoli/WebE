import { Card, CardType, Color, Hand, SimpleGame, State } from "../model/Game";
import { ServerState } from "../model/ServerState";

function initialCardSet(): Card[] {
  let cardset: Card[] = [];
  // 1 - 15 for all colors
  for (const key in Color) {
    for (let index = 1; index <= 15; index++) {
      const card = {
        value: index,
        color: key,
        type: CardType.NUMBER,
      };
      cardset.push(card);
    }
  }

  // 5 times joker
  for (let index = 0; index < 5; index++) {
    const card = {
      value: 0,
      type: CardType.JOKER,
    };
    cardset.push(card);
  }

  // 3 times skip
  for (let index = 0; index < 3; index++) {
    const card = {
      value: 0,
      type: CardType.SKIP,
    };
    cardset.push(card);
  }

  return cardset;
}

function createHand(playerId: string, cardset: Card[]): Hand {
  let hand: Hand = {
    owner: playerId,
    cards: [],
  };

  for (let index = 0; index < 10; index++) {
    let card = cardset.pop();
    if (card !== undefined) {
      hand.cards.push(card);
    }
  }

  return hand;
}

export function initGameState(
  serverState: ServerState,
  game: SimpleGame
): State {
  let g = serverState.games.find((g) => g.id === game.id);

  if (g !== undefined) {
    // Init state with a full randomly sorted draw pile
    g.state = {
      hands: [],
      drawPile: initialCardSet().sort((a, b) => 0.5 - Math.random()),
      discardPile: new Map(),
    };

    // Create for every player a hand with 10 cards from the draw pile
    for (const player of g.players) {
      g.state.hands.push(createHand(player, g.state.drawPile));
    }
  }

  return g!.state!;
}
