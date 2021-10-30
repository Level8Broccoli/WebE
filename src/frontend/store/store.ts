import { io } from 'socket.io-client';
import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import { PrivatePlayer } from '../../shared/model/Player';
import { ChatResponse } from '../../shared/model/ResponseTypes';
import { Config, Game, LevelSystem } from '../../shared/model/Game';
import { i18n, Language } from '../i18n/i18n';
import { WebSocketPlugin } from './WebSocketPlugin';

export interface State {
    language: Language,
    connection: Boolean,
    showRules: Boolean,
    player: PrivatePlayer,
    games: Game[],
    gameInCreation: null | Config,
    gameInProgress: null | Game,
    errorLog: String[]
}

export const key: InjectionKey<Store<State>> = Symbol()

const socket = io(import.meta.env.VITE_WS_SERVER || "localhost:3030");

export const store = createStore<State>({
    state: {
        language: Language.ENGLISH,
        connection: false,
        showRules: false,
        player: {
            name: "",
            id: "",
            secret: "",
        },
        games: [],
        gameInCreation: null,
        gameInProgress: null,
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
            if (state.gameInCreation !== null) {
                return "game-in-creation";
            }
            if (state.gameInProgress !== null) {
                return "game-in-progress"
            }
            return "game-search";
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
                localStorage.setItem("language", "DE");
            } else {
                state.language = Language.ENGLISH;
                localStorage.setItem("language", "EN");
            }
        },
        switchRules(state) {
            state.showRules = !state.showRules;
        },
        registerPlayer() { /* handled by WebSocketPlugin */ },
        createGame() { /* handled by WebSocketPlugin */ },
        deleteGame() { /* handled by WebSocketPlugin */ },
        chat() { /* handled by WebSocketPlugin */ },
        joinGame() { /* handled by WebSocketPlugin */ },
        leaveGame() { /* handled by WebSocketPlugin */ },
        startGame() { /* handled by WebSocketPlugin */ },
        editPlayerName() { /* handled by WebSocketPlugin */ },
        registerExistingPlayer() { /* handled by WebSocketPlugin */ },
        logout(state) {
            state.player = {
                name: "",
                secret: "",
                id: "",
            };
            state.gameInProgress = null;
            state.games = [];
        },
        initNewGame(state) {
            state.gameInCreation = {
                maxPlayerCount: 6,
                levelCount: 8,
                levelSystem: LevelSystem.NORMAL
            }
        },
        updateGameInCreation(state, payload) {
            state.gameInCreation = payload.config;
        },
        updateGameInProgress(state, value: Game | null) {
            state.gameInProgress = value;
        },
        updateConnection(state, value: Boolean) {
            state.connection = value;
        },
        addToErrorLog(state, value: string) {
            state.errorLog.unshift(value);
        },
        addChatMessage(state, value: ChatResponse) {
            state.gameInProgress?.chat?.push(value);
        },
    },
    plugins: [WebSocketPlugin(socket)]
})
