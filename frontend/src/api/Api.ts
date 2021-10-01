import { io, Socket } from "socket.io-client";
import { DeleteGameRequest, JoinGameRequest, LeaveGameRequest, PrivatePlayer, SimpleGame } from "./RequestTypes";
import { DeleteGameResponse, ErrorResponse, JoinGameResponse, LeaveGameResponse } from "./ResponseTypes";

let socket: null | Socket = null;
const player: PrivatePlayer = { id: "", name: "", secret: "" }
const game: SimpleGame = { id: "" };

export function initApi() {
    socket = io(import.meta.env.VITE_WS_SERVER || "localhost:3000");

    socket.on("joinGame", (res: JoinGameResponse | ErrorResponse) => {
        if ("status" in res) {
            console.error(res.status);
        } else {
            console.log("joinGame", res);
        }
    });

    socket.on("leaveGame", (res: LeaveGameResponse | ErrorResponse) => {
        if ("status" in res) {
            console.error(res.status);
        } else {
            console.log("leaveGame", res);
        }
    });
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
