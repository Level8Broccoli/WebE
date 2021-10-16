import {
  Card,
  CardType,
  Color,
  NumberCard,
  SimpleGame,
  SpecialCard,
  State,
} from "../../shared/model/Game";
import { ServerState } from "../../shared/model/ServerState";

function initialCardSet(): Card[] {
  let cardset: Card[] = [];
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
  let cards = [];

  for (let index = 0; index < 10; index++) {
    let card = cardset.pop();
    if (card !== undefined) {
      cards.push(card);
    }
  }

  return cards;
}

export function initGameState(
  serverState: ServerState,
  game: SimpleGame
): State {
  let g = serverState.games.find((g) => g.id === game.id);

  if (g !== undefined) {
    // Init state with a full randomly sorted draw pile and the last joined person as beginner
    g.state = {
      activePlayerId: g.players[g.players.length - 1],
      hands: new Map(),
      drawPile: initialCardSet().sort((a, b) => 0.5 - Math.random()),
      discardPile: new Map(),
    };

    // Create for every player a hand with 10 cards from the draw pile
    for (const playerId of g.players) {
      g.state.hands.set(playerId, createHand(g.state.drawPile));
    }
  }

  return g!.state!;
}
