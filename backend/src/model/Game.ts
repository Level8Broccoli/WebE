export type Game = {
  id: string;
  creatorId: string;
  players: string[];
  gameConfig: GameConfig;
};

export type SimpleGame = {
  id: string;
};

export type GameConfig = {
  maxPlayerCountForGame: number;
};
