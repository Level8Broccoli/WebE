import { io } from 'socket.io-client';
import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import { PrivatePlayer } from '../../shared/model/Player';
import { ChatResponse } from '../../shared/model/ResponseTypes';
import { Config, Game, GameView, GameViewType, LevelSystem } from '../../shared/model/Game';
import { i18n, Language } from '../i18n/i18n';
import { WebSocketPlugin } from './WebSocketPlugin';

export interface State {
    language: Language,
    connection: Boolean,
    showRules: Boolean,
    player: PrivatePlayer,
    games: Game[],
    activeGame: GameView,
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
        activeGame: { type: GameViewType.NONE, data: null },
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
            if (state.activeGame.type === GameViewType.IN_CREATION) {
                return "game-in-creation";
            }
            if (state.activeGame.type === GameViewType.IN_PROGRESS) {
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
        removeInvalidPlayer(state) {
            localStorage.setItem("player-credentials-invalid", JSON.stringify(state.player));
            localStorage.removeItem("player-credentials");
            state.player = {
                name: "",
                id: "",
                secret: "",
            }
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
            state.activeGame = { type: GameViewType.NONE, data: null };
            state.games = [];
        },
        initNewGame(state) {
            state.activeGame = {
                type: GameViewType.IN_CREATION,
                data: {
                    maxPlayerCount: 6,
                    levelCount: 8,
                    levelSystem: LevelSystem.NORMAL
                }
            }
        },
        updateGameInCreation(state, payload) {
            state.activeGame.data = payload.config;
        },
        abortGameInCreation(state) {
            state.activeGame = { type: GameViewType.NONE, data: null };
        },
        updateGameInProgress(state, value: Game | null) {
            state.activeGame.data = value;
        },
        updateConnection(state, value: Boolean) {
            state.connection = value;
        },
        addToErrorLog(state, value: string) {
            state.errorLog.unshift(value);
        },
        addChatMessage(state, value: ChatResponse) {
            if (state.activeGame.type === GameViewType.IN_LOBBY || state.activeGame.type === GameViewType.IN_PROGRESS)
                state.activeGame.data.chat?.push(value);
        },
    },
    plugins: [WebSocketPlugin(socket)]
})
