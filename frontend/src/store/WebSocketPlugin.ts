import { io, Socket } from "socket.io-client";
import { Store } from "vuex";
import { RegisterPlayerRequest } from "../api/RequestTypes";
import { ErrorResponse, RegisterPlayerResponse } from "../api/ResponseTypes";
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
            store.commit("updatePlayerName", res.player.name);
            store.commit("updatePlayerId", res.player.id);
            store.commit("updatePlayerSecret", res.player.secret);
        }
    });

    store.subscribe((mutation, state) => {
        console.log({ mutation, state });

        if (mutation.type === "registerPlayer") {
            const payload: RegisterPlayerRequest = { playerName: state.playerName };
            socket.emit("registerPlayer", payload);
        }
    });
}
