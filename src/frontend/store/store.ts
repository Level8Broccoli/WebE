import { io } from 'socket.io-client';
import { InjectionKey } from 'vue';
import { createStore, Store } from 'vuex';
import { Card, Config, Game, GameStatus, LevelSystem, OtherPlayerAggregate, PublicGame } from '../../shared/model/Game';
import { PrivatePlayer, PublicPlayer } from '../../shared/model/Player';
import { ChatResponse } from '../../shared/model/ResponseTypes';
import { i18n, Language } from '../i18n/i18n';
import { WebSocketPlugin } from './WebSocketPlugin';

export interface State {
    language: Language,
    connection: Boolean,
    showRules: Boolean,
    player: PrivatePlayer,
    playerList: PublicPlayer[],
    games: PublicGame[],
    gameInCreation?: Config,
    activeGameId: string,
    errorLog: string[]
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
        playerList: [],
        games: [],
        gameInCreation: undefined,
        activeGameId: "",
        errorLog: [],
    },
    getters: {
        i18n: (state) => {
            return i18n(state.language);
        },
        getActiveGame: (state) => {
            const activeGame = state.games.find(g => g.id === state.activeGameId);
            if (typeof activeGame === "undefined") {
                throw new Error("Active Game ID is wrong!");
            }
            return activeGame;
        },
        view: (state, getters) => {
            const activeGame = state.activeGameId.length > 0
                && getters.getActiveGame as PublicGame;
            if (state.showRules) {
                return "rules";
            }
            if (!(state.player.secret.length > 0)) {
                return "start";
            }
            if (typeof state.gameInCreation !== "undefined") {
                return "game-in-creation";
            }
            if (activeGame && activeGame.status === GameStatus.IN_LOBBY) {
                return "game-in-lobby"
            }
            if (activeGame && activeGame.status === GameStatus.IN_PROGRESS) {
                return "game-in-progress"
            }
            return "game-search";
        },
        getPlayerName(state) {
            return (playerId: string) => {
                return state.playerList.find(p => p.id === playerId)?.name;
            };
        },
        getMyHands(state, getters): Card[] {
            const activeGame = state.activeGameId.length > 0
                && getters.getActiveGame as PublicGame;

            return activeGame && activeGame.state.hands.get(state.player.id) as Card[] || [];
        },
        aggregateOtherPlayers(state, getters): OtherPlayerAggregate[] {
            const activeGame = state.activeGameId.length > 0
                && getters.getActiveGame as PublicGame;

            if (!activeGame) {
                return [];
            }
            const activePlayerId = activeGame.state.activePlayerId;
            const playerIdList = activeGame.players;
            const hands = activeGame.state.hands;
            const piles = activeGame.state.piles;
            const aggregate: OtherPlayerAggregate[] = [];

            for (const playerId of playerIdList) {
                if (playerId !== state.player.id) {
                    aggregate.push({
                        playerId,
                        isActivePlayer: playerId === activePlayerId,
                        handCardCount: hands.get(playerId) as number,
                        discardPile: piles.get(playerId) as Card[]
                    });
                } else {
                    aggregate.push({
                        playerId,
                        isActivePlayer: playerId === activePlayerId,
                        handCardCount: (hands.get(playerId) as Card[]).length,
                        discardPile: piles.get(playerId) as Card[]
                    });
                }
            }
            return aggregate;
        },
        getDrawPileCount(state, getters): number {
            const activeGame = state.activeGameId.length > 0
                && getters.getActiveGame as PublicGame;
            if (!activeGame) {
                return 0;
            }
            return activeGame.state.piles.get("drawPile") as number;
        }
    },
    mutations: {
        updatePlayerName(state, value: string) {
            state.player.name = value;
        },
        updatePlayer(state, value: PrivatePlayer) {
            state.player = value;
        },
        updatePlayerList(state, value: PublicPlayer[]) {
            state.playerList = value;
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
        addGame(state, value: Game) {
            state.games.push(value);
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
        finalizeGameCreation() { /* handled by WebSocketPlugin */ },
        joinGame() { /* handled by WebSocketPlugin */ },
        sendChatMessage() { /* handled by WebSocketPlugin */ },
        deleteGame() { /* handled by WebSocketPlugin */ },
        leaveGame() { /* handled by WebSocketPlugin */ },
        editPlayerName() { /* handled by WebSocketPlugin */ },
        registerExistingPlayer() { /* handled by WebSocketPlugin */ },
        logout() { /* handled by WebSocketPlugin */ },
        startGame() { /* handled by WebSocketPlugin */ },
        resetState(state) {
            state.player = {
                name: "",
                secret: "",
                id: "",
            };
            state.activeGameId = "";
            state.gameInCreation = undefined;
            state.games = [];
        },
        initNewGame(state) {
            state.gameInCreation = {
                maxPlayerCount: 6,
                levelCount: 8,
                levelSystem: LevelSystem.NORMAL
            }
        },
        updateGameInCreation(state, payload: Config) {
            state.gameInCreation = payload;
        },
        deleteGameInCreation(state) {
            state.gameInCreation = undefined;
        },
        abortGameInCreation(state) {
            state.gameInCreation = undefined;
        },
        abortGameInLobby(state) {
            state.activeGameId = "";
        },
        activateGame(state, payload: string) {
            state.activeGameId = payload;
        },
        createThirdPartyGame(state, payload: Game) {
            state.games.push(payload);
        },
        updateConnection(state, value: Boolean) {
            state.connection = value;
        },
        addToErrorLog(state, value: string) {
            state.errorLog.unshift(value);
        },
        addChatMessage(state, value: ChatResponse) {
            const activeGame = state.games.find(g => g.id === state.activeGameId);
            activeGame?.chat.push(value);

        }
    },
    plugins: [WebSocketPlugin(socket)]
})
