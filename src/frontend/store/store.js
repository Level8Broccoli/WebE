import { io } from 'socket.io-client';
import { createStore } from 'vuex';
import { WebSocketPlugin } from './WebSocketPlugin';
export const key = Symbol();
const socket = io(import.meta.env.VITE_WS_SERVER || "localhost:3000");
export const store = createStore({
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
        updatePlayerName(state, value) {
            state.player.name = value;
        },
        updatePlayer(state, value) {
            state.player = value;
        },
        updateGames(state, value) {
            state.games = value;
        },
        registerPlayer() { },
        createGame() { },
        deleteGame() { },
        chat() { },
        joinGame() { },
        leaveGame() { },
        editPlayerName() { },
        logout(state) {
            state.player = {
                name: "",
                secret: "",
                id: "",
            };
            state.activeGame = null;
            state.games = [];
        },
        updateActiveGame(state, value) {
            state.activeGame = value;
        },
        addToErrorLog(state, value) {
            state.errorLog.unshift(value);
        },
        addChatMessage(state, value) {
            state.activeGame?.chat?.push(value);
        },
    },
    plugins: [WebSocketPlugin(socket)]
});
//# sourceMappingURL=store.js.map