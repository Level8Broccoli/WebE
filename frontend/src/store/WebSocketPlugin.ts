import { Socket } from "socket.io-client";
import { Store } from "vuex";
import { CreateGameRequest, RegisterPlayerRequest } from "../api/RequestTypes";
import { CreateGameResponse, ErrorResponse, RegisterPlayerResponse } from "../api/ResponseTypes";
import { State } from "./store";

export const WebSocketPlugin = (socket: Socket) => (store: Store<State>) => {

    socket.on("connect", () => {
        console.log("connected", socket?.id);
    });

    socket.on("disconnect", (reason) => {
        console.log("disconnected", reason);
    });

    socket.on("registerPlayer", (res: RegisterPlayerResponse | ErrorResponse) => {
        console.log(res);

        if ("player" in res) {
            store.commit("updatePlayer", res.player);
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

    store.subscribe((mutation, state) => {
        if (mutation.type === "registerPlayer") {
            const payload: RegisterPlayerRequest = { playerName: state.player.name };
            socket.emit("registerPlayer", payload);
        }

        if (mutation.type === "createGame") {
            console.log(mutation.payload);

            const payload: CreateGameRequest = {
                player: state.player,
                config: {
                    maxPlayerCountForGame: mutation.payload
                }
            };
            socket.emit("createGame", payload);
        }
    });
}
