import { Socket } from "socket.io-client";
import { Store } from "vuex";
import { ChatRequest, CreateGameRequest, DeleteGameRequest, JoinGameRequest, LeaveGameRequest, RegisterPlayerRequest } from "../api/RequestTypes";
import { ChatResponse, CreateGameResponse, DeleteGameResponse, ErrorResponse, JoinGameResponse, LeaveGameResponse, RegisterPlayerResponse } from "../api/ResponseTypes";
import { State } from "./store";

export const WebSocketPlugin = (socket: Socket) => (store: Store<State>) => {

    socket.on("connect", () => {
        console.log("connected", socket.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("disconnected", reason);
        store.commit("addToErrorLog", reason);
    });

    socket.on("registerPlayer", (res: RegisterPlayerResponse | ErrorResponse) => {
        if ("player" in res) {
            store.commit("updatePlayer", res.player);
            store.commit("updateGames", res.games);
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });

    socket.on("createGame", (res: CreateGameResponse | ErrorResponse) => {
        if ("game" in res) {
            store.commit("updateActiveGame", res.game);
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });

    socket.on("deleteGame", (res: DeleteGameResponse | ErrorResponse) => {
        if ("game" in res) {
            store.commit("updateActiveGame", null);
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });

    socket.on("chat", (res: ChatResponse | ErrorResponse) => {
        if ("message" in res) {
            store.commit("addChatMessage", res);
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });

    socket.on("joinGame", (res: JoinGameResponse | ErrorResponse) => {
        if ("game" in res) {
            store.commit("updateActiveGame", res.game);
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });

    socket.on("leaveGame", (res: LeaveGameResponse | ErrorResponse) => {
        if ("game" in res) {
            store.commit("updateActiveGame", null);
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });

    store.subscribe((mutation, state) => {
        if (mutation.type === "registerPlayer") {
            const payload: RegisterPlayerRequest = { playerName: state.player.name };
            socket.emit("registerPlayer", payload);
        }

        if (mutation.type === "createGame") {
            const payload: CreateGameRequest = {
                player: state.player,
                config: {
                    maxPlayerCount: mutation.payload
                }
            };
            socket.emit("createGame", payload);
        }

        if (mutation.type === "deleteGame") {
            if (state.activeGame === null) {
                console.error("can't delete empty game");
                store.commit("addToErrorLog", "can't delete empty game");
                return;
            }
            const payload: DeleteGameRequest = {
                player: state.player,
                game: state.activeGame
            };
            socket.emit("deleteGame", payload);
        }

        if (mutation.type === "chat") {
            if (state.activeGame === null) {
                console.error("can't chat with empty game");
                store.commit("addToErrorLog", "can't chat with empty game");
                return;
            }
            const payload: ChatRequest = {
                player: state.player,
                game: state.activeGame,
                message: mutation.payload
            };
            socket.emit("chat", payload);
        }

        if (mutation.type === "joinGame") {
            const payload: JoinGameRequest = {
                player: state.player,
                game: {
                    id: mutation.payload,
                },
            };
            socket.emit("joinGame", payload);
        }

        if (mutation.type === "leaveGame") {
            if (state.activeGame === null) {
                console.error("can't leave an empty game");
                store.commit("addToErrorLog", "can't leave an empty game");
                return;
            }
            const payload: LeaveGameRequest = {
                player: state.player,
                game: {
                    id: state.activeGame.id,
                },
            };
            socket.emit("leaveGame", payload);
        }
    });
}
