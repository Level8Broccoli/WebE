import { io, Socket } from "socket.io-client";
import { CreateGameRequest, DeleteGameRequest, JoinGameRequest, LeaveGameRequest, RegisterPlayerRequest } from "./RequestTypes";

let socket: null | Socket = null;

export function initApi() {
    socket = io(import.meta.env.VITE_WS_SERVER || "localhost:3000");

    socket.on("connect", () => {
        console.log("connected", socket?.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("disconnected", reason);
    });

    socket.on("registerPlayer", (data: unknown) => {
        console.log("registerPlayer", data);
    });

    socket.on("createGame", (data: unknown) => {
        console.log("createGame", data);
    });
    socket.on("deleteGame", (data: unknown) => {
        console.log("deleteGame", data);
    });

    socket.on("joinGame", (data: unknown) => {
        console.log("joinGame", data);
    });

    socket.on("leaveGame", (data: unknown) => {
        console.log("leaveGame", data);
    });
}

export function registerPlayer(playerName: string) {
    const request: RegisterPlayerRequest = { playerName };
    socket?.emit("registerPlayer", request);
}

export function createGame() {
    const request: CreateGameRequest = {
        player: {
            id: "number1",
            name: "Tony",
            secret: "top-secret"
        }, gameConfig: { maxPlayerCountForGame: 1 }
    };
    socket?.emit("createGame", request);
}

export function deleteGame() {
    const request: DeleteGameRequest = {
        player: {
            id: "number1",
            name: "Tony",
            secret: "top-secret"
        },
        game: { id: "gameId" }
    };
    socket?.emit("deleteGame", request);
}

export function joinGame() {
    const request: JoinGameRequest = {
        player: {
            id: "number1",
            name: "Tony",
            secret: "top-secret"
        },
        game: { id: "gameId" }
    };
    socket?.emit("joinGame", request);
}

export function leaveGame() {
    const request: LeaveGameRequest = {
        player: {
            id: "number1",
            name: "Tony",
            secret: "top-secret"
        },
        game: { id: "gameId" }
    };
    socket?.emit("leaveGame", request);
}
