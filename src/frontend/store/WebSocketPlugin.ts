import { Socket } from "socket.io-client";
import { Store } from "vuex";
import { LevelSystem } from "../../shared/model/Game";
import { ChatRequest, CreateGameRequest, DeleteGameRequest, EditPlayerNameRequest, JoinGameRequest, LeaveGameRequest, RegisterExistingPlayerRequest, RegisterPlayerRequest, StartGameRequest } from "../../shared/model/RequestTypes";
import { ChatResponse, CreateGameResponse, DeleteGameResponse, ErrorResponse, JoinGameResponse, LeaveGameResponse, RegisterPlayerResponse, StartGameResponse, StartMoveResponse } from "../../shared/model/ResponseTypes";
import { State } from "./store";

export const WebSocketPlugin = (socket: Socket) => (store: Store<State>) => {

    socket.on("connect", () => {
        store.commit("updateConnection", true);
        console.log("connected", socket.id);
    });

    socket.on("disconnect", (reason) => {
        store.commit("updateConnection", false);
        console.log("disconnected", reason);
        store.commit("addToErrorLog", reason);
    });

    socket.on("registerPlayer", (res: RegisterPlayerResponse | ErrorResponse) => {
        if ("player" in res) {
            store.commit("updatePlayer", res.player);
            store.commit("updateGames", res.games);
            localStorage.setItem('player-credentials', JSON.stringify(res.player));
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });

    socket.on("createGame", (res: CreateGameResponse | ErrorResponse) => {
        if ("game" in res) {
            if (res.game.creatorId === store.state.player.id) {
                store.commit("updateActiveGame", res.game);
            }
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });

    socket.on("deleteGame", (res: DeleteGameResponse | ErrorResponse) => {
        if ("game" in res) {
            if (res.game.id === store.state.activeGame?.id) {
                store.commit("updateActiveGame", null);
            }
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
            if (res.player.id === store.state.player.id) {
                store.commit("updateActiveGame", { ...res.game, chat: [] });
            }
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });

    socket.on("leaveGame", (res: LeaveGameResponse | ErrorResponse) => {
        if ("game" in res) {
            if (res.player.id === store.state.player.id) {
                store.commit("updateActiveGame", null);
            }
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });

    socket.on("startGame", (res: StartGameResponse | ErrorResponse) => {
        if ("hand" in res) {
            console.log("incoming: startGame", res);
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });

    socket.on("startMove", (res: StartMoveResponse | ErrorResponse) => {
        if ("timestamp" in res) {
            console.log("incoming: startMove", res);
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

        if (mutation.type === "registerExistingPlayer") {
            const payload: RegisterExistingPlayerRequest = { player: state.player };
            socket.emit("registerExistingPlayer", payload);
        }

        if (mutation.type === "createGame") {
            const payload: CreateGameRequest = {
                player: state.player,
                config: {
                    maxPlayerCount: mutation.payload,
                    levelCount: 2,
                    levelSystem: LevelSystem.NORMAL
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

        if (mutation.type === "editPlayerName") {
            const payload: EditPlayerNameRequest = {
                player: state.player
            };
            socket.emit("editPlayerName", payload);
        }

        if (mutation.type === "startGame") {
            if (state.activeGame === null) {
                console.error("can't start an empty game");
                store.commit("addToErrorLog", "can't start an empty game");
                return;
            }
            const payload: StartGameRequest = {
                player: state.player,
                game: state.activeGame
            };
            socket.emit("startGame", payload);
        }
    });
}
