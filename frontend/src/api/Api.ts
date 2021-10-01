import { io, Socket } from "socket.io-client";
import { CreateGameRequest, DeleteGameRequest, JoinGameRequest, LeaveGameRequest, PrivatePlayer, RegisterPlayerRequest, SimpleGame } from "./RequestTypes";
import { CreateGameResponse, DeleteGameResponse, ErrorCode, ErrorResponse, JoinGameResponse, LeaveGameResponse, RegisterPlayerResponse } from "./ResponseTypes";

let socket: null | Socket = null;
const player: PrivatePlayer = { id: "", name: "", secret: "" }
const game: SimpleGame = { id: "" };

export function initApi() {
    socket = io(import.meta.env.VITE_WS_SERVER || "localhost:3000");

    socket.on("connect", () => {
        console.log("connected", socket?.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("disconnected", reason);
    });

    socket.on("createGame", (res: CreateGameResponse | ErrorResponse) => {
        if ("message" in res) {
            console.error(res.message);
        } else {
            console.log("createGame", res);
            game.id = res.game.id;
        }
    });

    socket.on("deleteGame", (res: DeleteGameResponse | ErrorResponse) => {
        if ("message" in res) {
            console.error(res.message);
        } else {
            console.log("deleteGame", res);
        }
    });

    socket.on("joinGame", (res: JoinGameResponse | ErrorResponse) => {
        if ("message" in res) {
            console.error(res.message);
        } else {
            console.log("joinGame", res);
        }
    });

    socket.on("leaveGame", (res: LeaveGameResponse | ErrorResponse) => {
        if ("message" in res) {
            console.error(res.message);
        } else {
            console.log("leaveGame", res);
        }
    });
}

export function registerPlayer(playerName: string) {
    const request: RegisterPlayerRequest = { playerName };
    socket?.emit("registerPlayer", request);
}

export function createGame(maxPlayerCountForGame: number) {
    const request: CreateGameRequest = {
        player,
        gameConfig: { maxPlayerCountForGame }
    };
    socket?.emit("createGame", request);
}

export function deleteGame() {
    const request: DeleteGameRequest = {
        player,
        game
    };
    socket?.emit("deleteGame", request);
}

export function joinGame() {
    const request: JoinGameRequest = {
        player,
        game
    };
    socket?.emit("joinGame", request);
}

export function leaveGame() {
    const request: LeaveGameRequest = {
        player,
        game
    };
    socket?.emit("leaveGame", request);
}
