import { DateTime } from "luxon";

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
    timestamp: DateTime;
    player: PublicPlayer;
    game: Game;
};

export type DeleteGameResponse = {
    status: StatusCode;
    timestamp: DateTime;
    game: SimpleGame;
};

export type JoinGameResponse = {
    status: StatusCode;
    timestamp: DateTime;
    player: PublicPlayer;
    game: SimpleGame;
};

export type LeaveGameResponse = {
    status: StatusCode;
    timestamp: DateTime;
    player: PublicPlayer;
    game: SimpleGame;
};

export type Config = {
    maxPlayerCount: number;
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
    chat: ChatResponse[];
};

export type RegisterPlayerResponse = {
    status: StatusCode;
    timestamp: DateTime;
    player: PrivatePlayer;
    games: Game[];
};

export type ChatResponse = {
    timestamp: DateTime;
    player: PublicPlayer;
    message: string;
};
