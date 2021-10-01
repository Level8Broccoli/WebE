export type RegisterPlayerRequest = {
    playerName: string;
};

export interface PublicPlayer {
    id: string;
    name: string;
}

export interface PrivatePlayer extends PublicPlayer {
    secret: string;
}

export type Config = {
    maxPlayerCountForGame: number;
};

export type CreateGameRequest = {
    player: PrivatePlayer;
    config: Config;
};

export type SimpleGame = {
    id: string;
};

export type DeleteGameRequest = {
    player: PrivatePlayer;
    game: SimpleGame;
};

export type JoinGameRequest = {
    player: PrivatePlayer;
    game: SimpleGame;
};

export type LeaveGameRequest = {
    player: PrivatePlayer;
    game: SimpleGame;
};
