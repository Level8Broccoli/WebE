import { io } from 'socket.io-client';
import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import { PrivatePlayer } from '../../shared/model/Player';
import { ChatResponse } from '../../shared/model/ResponseTypes';
import { Game } from '../../shared/model/Game';
import { i18n, Language } from '../i18n/i18n';
import { WebSocketPlugin } from './WebSocketPlugin';

export interface State {
    language: Language,
    connection: Boolean,
    showRules: Boolean,
    createGameMode: Boolean,
    player: PrivatePlayer,
    games: Game[],
    activeGame: null | Game,
    errorLog: String[]
}

export const key: InjectionKey<Store<State>> = Symbol()

const socket = io(import.meta.env.VITE_WS_SERVER || "localhost:3030");

export const store = createStore<State>({
    state: {
        language: Language.ENGLISH,
        connection: false,
        showRules: false,
        createGameMode: false,
        player: {
            name: "",
            id: "",
            secret: "",
        },
        games: [],
        activeGame: null,
        errorLog: [],
    },
    getters: {
        i18n: (state) => {
            return i18n(state.language);
        },
        view: (state) => {
            if (state.showRules) {
                return "rules";
            }
            if (!(state.player.secret.length > 0)) {
                return "start";
            }
            if (state.createGameMode) {
                return "create-game";
            }
            if (state.activeGame === null) {
                return "game-search";
            }
            return "unknown"
        }
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
        switchLanguage(state) {
            const currLanguage = state.language;
            if (currLanguage === Language.ENGLISH) {
                state.language = Language.GERMAN;
            } else {
                state.language = Language.ENGLISH;
            }
        },
        switchRules(state) {
            state.showRules = !state.showRules;
        },
        switchCreateGameMode(state) {
            state.createGameMode = !state.createGameMode;
        },
        registerPlayer() { /* handled by WebSocketPlugin */ },
        createGame() { /* handled by WebSocketPlugin */ },
        deleteGame() { /* handled by WebSocketPlugin */ },
        chat() { /* handled by WebSocketPlugin */ },
        joinGame() { /* handled by WebSocketPlugin */ },
        leaveGame() { /* handled by WebSocketPlugin */ },
        startGame() { /* handled by WebSocketPlugin */ },
        editPlayerName() { /* handled by WebSocketPlugin */ },
        logout(state) {
            state.player = {
                name: "",
                secret: "",
                id: "",
            };
            state.activeGame = null;
            state.games = [];
        },
        updateActiveGame(state, value: Game | null) {
            state.activeGame = value;
        },
        updateConnection(state, value: Boolean) {
            state.connection = value;
        },
        addToErrorLog(state, value: string) {
            state.errorLog.unshift(value);
        },
        addChatMessage(state, value: ChatResponse) {
            state.activeGame?.chat?.push(value);
        },
    },
    plugins: [WebSocketPlugin(socket)]
})
