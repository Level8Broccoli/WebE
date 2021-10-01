import { io, Socket } from "socket.io-client";
import { CreateGameRequest, DeleteGameRequest, JoinGameRequest, LeaveGameRequest, PrivatePlayer, RegisterPlayerRequest, SimpleGame } from "./RequestTypes";
import { CreateGameResponse, DeleteGameResponse, ErrorCode, ErrorResponse, JoinGameResponse, LeaveGameResponse, RegisterPlayerResponse } from "./ResponseTypes";

let socket: null | Socket = null;
const player: PrivatePlayer = { id: "", name: "", secret: "" }
const game: SimpleGame = { id: "" };

export function initApi() {
    socket = io(import.meta.env.VITE_WS_SERVER || "localhost:3000");

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
