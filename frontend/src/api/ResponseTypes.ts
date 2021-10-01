import moment from "moment";

export enum StatusCode {
    OK = "OK",
    PLAYER_INVALID = "PLAYER_INVALID",
    ID_SECRET_INVALID = "ID_SECRET_INVALID",
    GAME_CONFIG_INVALID = "GAME_CONFIG_INVALID",
    GAME_CREATOR_INVALID = "GAME_CREATOR_INVALID",
    GAME_NOT_EXISTS = "GAME_NOT_EXISTS",
    PLAYER_ROOM_INVALID = "PLAYER_ROOM_INVALID",
    GAME_FULL = "GAME_FULL",
}

export type ErrorResponse = {
    status: StatusCode;
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
    status: StatusCode;
    timestamp: moment.Moment;
    player: PublicPlayer;
    game: Game;
};

export type DeleteGameResponse = {
    status: StatusCode;
    timestamp: moment.Moment;
    game: SimpleGame;
};

export type JoinGameResponse = {
    status: StatusCode;
    timestamp: moment.Moment;
    player: PublicPlayer;
    game: SimpleGame;
};

export type LeaveGameResponse = {
    status: StatusCode;
    timestamp: moment.Moment;
    player: PublicPlayer;
    game: SimpleGame;
};

export type Config = {
    maxPlayerCountForGame: number;
};

export type ChatMessage = {
    player: PublicPlayer;
    message: string;
};

export type Game = {
    id: string;
    creatorId: string;
    players: string[];
    config: Config;
    chat: ChatMessage[];
};

export type RegisterPlayerResponse = {
    status: StatusCode;
    timestamp: moment.Moment;
    player: PrivatePlayer;
    games: Game[];
};
