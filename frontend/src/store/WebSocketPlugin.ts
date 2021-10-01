import { io, Socket } from "socket.io-client";
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

        if ("message" in res) {
            console.error(res.message);
        } else {
            store.commit("updatePlayer", res.player);
        }
    });

    socket.on("createGame", (res: CreateGameResponse | ErrorResponse) => {
        if ("message" in res) {
            console.error(res.message);
        } else {
            store.commit("updateActiveGame", res.game);
        }
    });

    store.subscribe((mutation, state) => {
        console.log({ mutation, state });

        if (mutation.type === "registerPlayer") {
            const payload: RegisterPlayerRequest = { playerName: state.player.name };
            socket.emit("registerPlayer", payload);
        }

        if (mutation.type === "createGame") {
            const payload: CreateGameRequest = {
                player: state.player,
                config: {
                    maxPlayerCountForGame: state.maxPlayerCount
                }
            };
            socket.emit("createGame", payload);
        }
    });
}
