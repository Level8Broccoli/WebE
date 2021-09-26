import moment from "moment";

export enum ErrorCode {
    OK = "LVL8-OK",
    ERROR = "LVL8-ERROR",
}

export type ErrorResponse = {
    status: ErrorCode;
    message: string;
};
export interface PublicPlayer {
    id: string;
    name: string;
}

export interface PrivatePlayer extends PublicPlayer {
    secret: string;
}

export type SimpleGame = {
    id: string;
};

export type CreateGameResponse = {
    status: ErrorCode;
    timestamp: moment.Moment;
    player: PublicPlayer;
    game: Game;
};

export type DeleteGameResponse = {
    status: ErrorCode;
    timestamp: moment.Moment;
    game: SimpleGame;
};

export type JoinGameResponse = {
    status: ErrorCode;
    timestamp: moment.Moment;
    player: PublicPlayer;
    game: SimpleGame;
};

export type LeaveGameResponse = {
    status: ErrorCode;
    timestamp: moment.Moment;
    player: PublicPlayer;
    game: SimpleGame;
};

export type GameConfig = {
    maxPlayerCountForGame: number;
};

export type Game = {
    id: string;
    creatorId: string;
    players: string[];
    gameConfig: GameConfig;
};

export type RegisterPlayerResponse = {
    status: ErrorCode;
    timestamp: moment.Moment;
    player: PrivatePlayer;
    games: Game[];
};
