import { Socket } from "socket.io-client";
import { Store } from "vuex";
import { ChatRequest, CreateGameRequest, DeleteGameRequest, DiscardCardRequest, DrawCardRequest, EditPlayerNameRequest, FinishFulfillmentRequest, JoinGameRequest, LeaveGameRequest, LogoutRequest, PlayCardRequest, RegisterExistingPlayerRequest, RegisterPlayerRequest, SkipLevelFulfillStepRequest, SkipPlayCardsStepRequest, StartGameRequest } from "../../shared/model/RequestTypes";
import { ChatResponse, CreateGameResponse, DeleteGameResponse, EditPlayerNameResponse, ErrorResponse, JoinGameResponse, LeaveGameResponse, LogoutResponse, RegisterExistingPlayerResponse, RegisterPlayerResponse, StartGameResponse, UpdateGameBoardResponse, UpdateGameListResponse, UpdatePlayerListResponse } from "../../shared/model/ResponseTypes";
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

    socket.on("logout", (res: LogoutResponse | ErrorResponse) => {
        if ("playerId" in res) {
            store.commit("resetState");
            localStorage.removeItem('player-credentials');
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

    socket.on("updateGameList", (res: UpdateGameListResponse | ErrorResponse) => {
        if ("gameList" in res) {
            store.commit("updateGames", res.gameList);
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    })

    socket.on("registerExistingPlayer", (res: RegisterExistingPlayerResponse | ErrorResponse) => {
        if ("player" in res) {
            store.commit("updatePlayer", res.player);
            store.commit("updateGames", res.games);
            store.commit("activateGame", res.activeGameId);
            localStorage.setItem('player-credentials', JSON.stringify(res.player));
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
                store.commit("activateGame", res.game.id);
                store.commit("deleteGameInCreation")
            }
            store.commit("addGame", res.game);
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });

    socket.on("deleteGame", (res: DeleteGameResponse | ErrorResponse) => {
        if ("gameId" in res) {
            if (store.state.activeGameId === res.gameId) {
                store.commit("abortGameInLobby");
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
                store.commit("activateGame", res.game.id);
            }
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });

    socket.on("leaveGame", (res: LeaveGameResponse | ErrorResponse) => {
        if ("player" in res) {
            if (res.player.id === store.state.player.id) {
                store.commit("abortGameInLobby");
            }
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });

    socket.on("startGame", (res: StartGameResponse | ErrorResponse) => {
        if (!("gameId" in res)) {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    });

    socket.on("discardCard", (res: ErrorResponse) => {
        console.error(res.status);
        store.commit("addToErrorLog", res.status);
    })

    socket.on("skipLevelFulfillStep", (res: ErrorResponse) => {
        console.error(res.status);
        store.commit("addToErrorLog", res.status);
    })

    socket.on("skipPlayCardsStep", (res: ErrorResponse) => {
        console.error(res.status);
        store.commit("addToErrorLog", res.status);
    })

    socket.on("playCard", (res: UpdateGameBoardResponse | ErrorResponse) => {
        if ("gameId" in res) {
            store.commit("abortPlayCardStep");
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    })

    socket.on("finishFulfillment", (res: UpdateGameBoardResponse | ErrorResponse) => {
        if ("gameId" in res) {
            store.commit("abortFulfillment");
        } else {
            console.error(res.status);
            store.commit("addToErrorLog", res.status);
        }
    })

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

        if (mutation.type === "deleteGame") {
            const payload: DeleteGameRequest = {
                player: state.player,
                gameId: state.activeGameId
            };
            socket.emit("deleteGame", payload);
        }

        if (mutation.type === "sendChatMessage") {
            const payload: ChatRequest = {
                player: state.player,
                gameId: state.activeGameId,
                message: mutation.payload
            };
            socket.emit("chat", payload);
        }

        if (mutation.type === "joinGame") {
            const payload: JoinGameRequest = {
                player: state.player,
                gameId: mutation.payload,
            };
            socket.emit("joinGame", payload);
        }

        if (mutation.type === "leaveGame") {
            const payload: LeaveGameRequest = {
                player: state.player,
                gameId: state.activeGameId,
            };
            socket.emit("leaveGame", payload);
        }

        if (mutation.type === "editPlayerName") {
            const payload: EditPlayerNameRequest = {
                player: state.player
            };
            socket.emit("editPlayerName", payload);
        }

        if (mutation.type === "logout") {
            const payload: LogoutRequest = {
                player: state.player
            };
            socket.emit("logout", payload);
        }

        if (mutation.type === "startGame") {
            const payload: StartGameRequest = {
                gameId: store.state.activeGameId,
                player: store.state.player
            }
            socket.emit("startGame", payload);
        }

        if (mutation.type === "discardCard") {
            const payload: DiscardCardRequest = {
                cardId: mutation.payload.cardId,
                gameId: store.state.activeGameId,
                player: store.state.player
            }
            socket.emit("discardCard", payload);
        }

        if (mutation.type === "drawCard") {
            const payload: DrawCardRequest = {
                gameId: store.state.activeGameId,
                player: store.state.player,
                pileId: mutation.payload.pileId,
            }
            socket.emit("drawCard", payload);
        }

        if (mutation.type === "skipLevelFulfillStep") {
            const payload: SkipLevelFulfillStepRequest = {
                gameId: store.state.activeGameId,
                player: store.state.player,
            }
            socket.emit("skipLevelFulfillStep", payload);
        }

        if (mutation.type === "skipPlayCardsStep") {
            const payload: SkipPlayCardsStepRequest = {
                gameId: store.state.activeGameId,
                player: store.state.player,
            }
            socket.emit("skipPlayCardsStep", payload);
        }

        if (mutation.type === "playCard") {
            const payload: PlayCardRequest = {
                player: store.state.player,
                gameId: store.state.activeGameId,
                cardId: store.state.tempCardIdForPlay,
                cardRowId: mutation.payload,
            }
            socket.emit("playCard", payload);
        }

        if (mutation.type === "finishFulfillment") {
            const payload: FinishFulfillmentRequest = {
                gameId: store.state.activeGameId,
                player: store.state.player,
                level: store.state.cardRowsForFulfillment,
            }
            socket.emit("finishFulfillment", payload);
        }
    });
}
