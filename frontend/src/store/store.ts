import { io } from 'socket.io-client';
import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'
import { registerPlayer } from '../api/Api';
import { WebSocketPlugin } from './WebSocketPlugin';

export interface State {
    playerName: string,
    playerId: string,
    playerSecret: string
}

export const key: InjectionKey<Store<State>> = Symbol()

const socket = io(import.meta.env.VITE_WS_SERVER || "localhost:3000");

export const store = createStore<State>({
    state: {
        playerName: "",
        playerId: "",
        playerSecret: ""
    },
    mutations: {
        updatePlayerName(state, value) {
            state.playerName = value;
        },
        updatePlayerId(state, value) {
            state.playerId = value;
        },
        updatePlayerSecret(state, value) {
            state.playerSecret = value;
        },
        registerPlayer() {

        }
    },
    plugins: [WebSocketPlugin(socket)]
})
