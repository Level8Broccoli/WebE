import { Socket } from "socket.io-client";
import { Store } from "vuex";
import { CreateGameRequest, EditPlayerNameRequest, RegisterExistingPlayerRequest, RegisterPlayerRequest } from "../../shared/model/RequestTypes";
import { CreateGameResponse, EditPlayerNameResponse, ErrorResponse, RegisterExistingPlayerResponse, RegisterPlayerResponse, UpdatePlayerListResponse } from "../../shared/model/ResponseTypes";
import { State } from "./store";

export const WebSocketPlugin = (socket: Socket) => (store: Store<State>) => {

    socket.on("connect", () => {
        store.commit("updateConnection", true);
    });

    socket.on("disconnect", (reason) => {
        store.commit("updateConnection", false);
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

    socket.on("updatePlayerList", (res: UpdatePlayerListResponse | ErrorResponse) => {
        if ("playerList" in res) {
            store.commit("updatePlayerList", res.playerList);
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    })

    socket.on("registerExistingPlayer", (res: RegisterExistingPlayerResponse | ErrorResponse) => {
        if ("player" in res) {
            store.commit("updatePlayer", res.player);
            store.commit("updateGames", res.games);
            localStorage.setItem('player-credentials', JSON.stringify(res.player));

            if (typeof res.activeGame !== undefined) {
                store.commit("activateGame", res.activeGame);
            }

        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
            store.commit("removeInvalidPlayer");
        }
    });

    socket.on("editPlayerName", (res: EditPlayerNameResponse | ErrorResponse) => {
        if ("player" in res) {
            localStorage.setItem('player-credentials', JSON.stringify(res.player));
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
            store.commit("removeInvalidPlayer");
        }
    });

    socket.on("createGame", (res: CreateGameResponse | ErrorResponse) => {
        if ("game" in res) {
            if (res.game.creatorId === store.state.player.id) {
                store.commit("activateGame", res.game);
            }
            store.commit("deleteGameInCreation")
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });

    // socket.on("deleteGame", (res: DeleteGameResponse | ErrorResponse) => {
    //     if ("game" in res) {
    //         if (store.state.activeGame.type === GameViewType.IN_LOBBY || store.state.activeGame.type === GameViewType.IN_PROGRESS && res.game.id === store.state.activeGame.data?.id) {
    //             store.commit("updateGameInProgress", null);
    //         }
    //     } else {
    //         console.error(res.status);
    //         store.commit("addToErrorLog", res.status);
    //     }
    // });

    // socket.on("chat", (res: ChatResponse | ErrorResponse) => {
    //     if ("message" in res) {
    //         store.commit("addChatMessage", res);
    //     } else {
    //         console.error(res.status);
    //         store.commit("addToErrorLog", res.status);
    //     }
    // });

    // socket.on("joinGame", (res: JoinGameResponse | ErrorResponse) => {
    //     if ("game" in res) {
    //         if (res.player.id === store.state.player.id) {
    //             store.commit("createGameInLobby", res.game);
    //         }
    //     } else {
    //         console.error(res.status);
    //         store.commit("addToErrorLog", res.status);
    //     }
    // });

    // socket.on("leaveGame", (res: LeaveGameResponse | ErrorResponse) => {
    //     if ("game" in res) {
    //         if (res.player.id === store.state.player.id) {
    //             store.commit("updateGameInProgress", null);
    //         }
    //     } else {
    //         console.error(res.status);
    //         store.commit("addToErrorLog", res.status);
    //     }
    // });

    // socket.on("startGame", (res: StartGameResponse | ErrorResponse) => {
    //     if ("hand" in res) {
    //     } else {
    //         console.error(res.status);
    //         store.commit("addToErrorLog", res.status);
    //     }
    // });

    // socket.on("startMove", (res: StartMoveResponse | ErrorResponse) => {
    //     if ("timestamp" in res) {
    //     } else {
    //         console.error(res.status);
    //         store.commit("addToErrorLog", res.status);
    //     }
    // });

    store.subscribe((mutation, state) => {
        if (mutation.type === "registerPlayer") {
            const payload: RegisterPlayerRequest = { playerName: state.player.name };
            socket.emit("registerPlayer", payload);
        }

        if (mutation.type === "registerExistingPlayer") {
            const payload: RegisterExistingPlayerRequest = { player: state.player };
            socket.emit("registerExistingPlayer", payload);
        }

        if (mutation.type === "finalizeGameCreation") {
            if (typeof state.gameInCreation === "undefined") {
                throw new Error("Missing Config for Creation of new Game!");
            }
            const payload: CreateGameRequest = {
                player: state.player,
                config: state.gameInCreation
            };
            socket.emit("createGame", payload);
        }

        // if (mutation.type === "deleteGame") {
        //     if (state.activeGame.type === GameViewType.NONE || state.activeGame.type === GameViewType.IN_CREATION) {
        //         console.error("can't delete empty game");
        //         store.commit("addToErrorLog", "can't delete empty game");
        //         return;
        //     }
        //     const payload: DeleteGameRequest = {
        //         player: state.player,
        //         game: state.activeGame.data
        //     };
        //     socket.emit("deleteGame", payload);
        // }

        // if (mutation.type === "chat") {
        //     if (state.activeGame.type === GameViewType.NONE || state.activeGame.type === GameViewType.IN_CREATION) {
        //         console.error("can't chat with empty game");
        //         store.commit("addToErrorLog", "can't chat with empty game");
        //         return;
        //     }
        //     const payload: ChatRequest = {
        //         player: state.player,
        //         game: state.activeGame.data,
        //         message: mutation.payload
        //     };
        //     socket.emit("chat", payload);
        // }

        // if (mutation.type === "joinGame") {
        //     const payload: JoinGameRequest = {
        //         player: state.player,
        //         game: {
        //             id: mutation.payload,
        //         },
        //     };
        //     socket.emit("joinGame", payload);
        // }

        // if (mutation.type === "leaveGame") {
        //     if (state.activeGame.type === GameViewType.NONE || state.activeGame.type === GameViewType.IN_CREATION) {
        //         console.error("can't leave an empty game");
        //         store.commit("addToErrorLog", "can't leave an empty game");
        //         return;
        //     }
        //     const payload: LeaveGameRequest = {
        //         player: state.player,
        //         game: {
        //             id: state.activeGame.data.id,
        //         },
        //     };
        //     socket.emit("leaveGame", payload);
        // }

        if (mutation.type === "editPlayerName") {
            const payload: EditPlayerNameRequest = {
                player: state.player
            };
            socket.emit("editPlayerName", payload);
        }

        // if (mutation.type === "startGame") {
        //     if (state.activeGame.type === GameViewType.NONE || state.activeGame.type === GameViewType.IN_CREATION) {
        //         console.error("can't start an empty game");
        //         store.commit("addToErrorLog", "can't start an empty game");
        //         return;
        //     }
        //     const payload: StartGameRequest = {
        //         player: state.player,
        //         game: state.activeGame.data
        //     };
        //     socket.emit("startGame", payload);
        // }
    });
}
