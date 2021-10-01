import { io } from 'socket.io-client';
import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import { PrivatePlayer } from '../api/RequestTypes';
import { ChatResponse, Game } from '../api/ResponseTypes';
import { WebSocketPlugin } from './WebSocketPlugin';

export interface State {
    player: PrivatePlayer,
    games: Game[],
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
        games: [],
        activeGame: null,
        errorLog: [],
    },
    mutations: {
        updatePlayerName(state, value: string) {
            state.player.name = value;
        },
        updatePlayer(state, value: PrivatePlayer) {
            state.player = value;
        },
        updateGames(state, value: Game[]) {
            state.games = value;
        },
        registerPlayer() { /* handled by WebSocketPlugin */ },
        createGame() { /* handled by WebSocketPlugin */ },
        deleteGame() { /* handled by WebSocketPlugin */ },
        chat() { /* handled by WebSocketPlugin */ },
        joinGame() { /* handled by WebSocketPlugin */ },
        leaveGame() { /* handled by WebSocketPlugin */ },
        editPlayerName() { /* handled by WebSocketPlugin */ },
        updateActiveGame(state, value: Game | null) {
            state.activeGame = value;
        },
        addToErrorLog(state, value: string) {
            state.errorLog.unshift(value);
        },
        addChatMessage(state, value: ChatResponse) {
            state.activeGame?.chat.push(value);
        },
    },
    plugins: [WebSocketPlugin(socket)]
})
