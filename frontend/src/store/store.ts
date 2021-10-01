import { io } from 'socket.io-client';
import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import { PrivatePlayer } from '../api/RequestTypes';
import { Game } from '../api/ResponseTypes';
import { WebSocketPlugin } from './WebSocketPlugin';

export interface State {
    player: PrivatePlayer,
    activeGame: null | Game,
    errorLog: String[]
}

export const key: InjectionKey<Store<State>> = Symbol()

const socket = io(import.meta.env.VITE_WS_SERVER || "localhost:3000");

export const store = createStore<State>({
    state: {
        player: {
            name: "",
            id: "",
            secret: "",
        },
        activeGame: null,
        errorLog: [],
    },
    mutations: {
        updatePlayerName(state, value) {
            state.player.name = value;
        },
        updatePlayer(state, value) {
            console.log("updatePlayer", { value });
            state.player = value;
        },
        registerPlayer() { },
        createGame() { },
        updateActiveGame(state, value) {
            state.activeGame = value;
        },
        addToErrorLog(state, value) {
            state.errorLog.unshift(value);
        }
    },
    plugins: [WebSocketPlugin(socket)]
})
