import { stat } from "fs";
import { io } from "socket.io-client";
import { InjectionKey } from "vue";
import { createStore, Store } from "vuex";
import {
  Card,
  CardRow,
  CardRowRequest,
  CardRowType,
  CardStackOpen,
  CardStackSecret,
  CardType,
  Config,
  DRAW_PILE_ID,
  Game,
  GameRule,
  GameRules,
  GameStatus,
  LevelSystem,
  PlayerLevel,
  PlayerOverviewAggregate,
} from "../../shared/model/Game";
import { LeaderboardEntry } from "../../shared/model/Leaderboard";
import { PrivatePlayer, PublicPlayer } from "../../shared/model/Player";
import { ChatResponse } from "../../shared/model/ResponseTypes";
import { i18n, Language } from "../i18n/i18n";
import { WebSocketPlugin } from "./WebSocketPlugin";

export interface State {
  language: Language;
  connection: boolean;
  overwriteView: string;
  player: PrivatePlayer;
  playerList: PublicPlayer[];
  games: Game[];
  gameInCreation?: Config;
  activeGameId: string;
  tempCardIdForPlay: string;
  tempCardsForFulfillment: string[];
  cardRowsForFulfillment: CardRowRequest[];
  leaderboard: LeaderboardEntry[];
  errorLog: string[];
}

export const key: InjectionKey<Store<State>> = Symbol();

const socket = io(import.meta.env.VITE_WS_SERVER || "localhost:3030");

export const store = createStore<State>({
  state: {
    language: Language.ENGLISH,
    connection: false,
    overwriteView: "",
    player: {
      name: "",
      id: "",
      secret: "",
    },
    playerList: [],
    games: [],
    gameInCreation: undefined,
    activeGameId: "",
    tempCardIdForPlay: "",
    tempCardsForFulfillment: [],
    cardRowsForFulfillment: [],
    leaderboard: [],
    errorLog: [],
  },
  getters: {
    i18n: (state) => {
      return i18n(state.language);
    },
    getActiveGame: (state): Game => {
      const activeGame = state.games.find((g) => g.id === state.activeGameId);
      if (typeof activeGame === "undefined") {
        throw new Error("Active Game ID is wrong!");
      }
      return activeGame;
    },
    getCurrentPlayerLevel: (state, getters): PlayerLevel | null => {
      const activeGame =
        state.activeGameId.length > 0 && (getters.getActiveGame as Game);
      if (!activeGame) {
        return null;
      }
      return activeGame.state.playerLevels.filter(
        (pl) => pl.playerId === state.player.id
      )[0];
    },
    view: (state, getters) => {
      const activeGame =
        state.activeGameId.length > 0 && (getters.getActiveGame as Game);
      if (state.overwriteView === "rules") {
        return "rules";
      }
      if (state.overwriteView === "leaderboard") {
        return "leaderboard";
      }
      if (!(state.player.secret.length > 0)) {
        return "start";
      }
      if (typeof state.gameInCreation !== "undefined") {
        return "game-in-creation";
      }
      if (activeGame && activeGame.status === GameStatus.IN_LOBBY) {
        return "game-in-lobby";
      }
      if (activeGame && activeGame.status === GameStatus.IN_PROGRESS) {
        return "game-in-progress";
      }
      if (activeGame && activeGame.status === GameStatus.FINISHED) {
        return "game-finished";
      }
      return "game-search";
    },
    getPlayerName(state) {
      return (playerId: string): string => {
        return state.playerList.find((p) => p.id === playerId)?.name || "";
      };
    },
    translateCurrentStep(_, getters) {
      return (step: number): string => {
        const i18n = getters.i18n;
        return i18n["currentStep" + String(step)];
      };
    },
    translateCurrentStepExplanation(_, getters) {
      return (step: number): string => {
        const i18n = getters.i18n;
        return i18n["currentStepExplanation" + String(step)];
      };
    },
    getMyHands(state, getters): string[] {
      const activeGame =
        state.activeGameId.length > 0 && (getters.getActiveGame as Game);

      return (
        (activeGame &&
          (
            activeGame.state.hands.find(
              (h) => h.id === state.player.id
            ) as CardStackOpen
          ).cardIds) ||
        []
      );
    },
    getTranslatedLevels(state, getters): string[] {
      const activeGame =
        state.activeGameId.length > 0 && (getters.getActiveGame as Game);
      const i18n = getters.i18n;

      if (!activeGame) {
        return [];
      }
      const levels = activeGame.levels;
      return levels.map((l) => i18n["lvl" + (l + 1)]);
    },
    myCurrentLevel(state, getters): number {
      const activeGame =
        state.activeGameId.length > 0 && (getters.getActiveGame as Game);

      if (!activeGame) {
        return -1;
      }
      const myCurrentLevel = activeGame.state.playerLevels.find(
        (l) => l.playerId === state.player.id
      )?.currentLevelIndex;
      return typeof myCurrentLevel === "undefined" ? -1 : myCurrentLevel;
    },
    getGameBoard(state, getters): CardRow[] {
      const activeGame =
        state.activeGameId.length > 0 && (getters.getActiveGame as Game);

      if (!activeGame) {
        return [];
      }
      return activeGame.state.board;
    },
    aggregateOtherPlayers(state, getters): PlayerOverviewAggregate[] {
      const activeGame =
        state.activeGameId.length > 0 && (getters.getActiveGame as Game);

      if (!activeGame) {
        return [];
      }
      const activePlayerId = activeGame.state.activePlayerId;
      const currentStep = activeGame.state.currentStep;
      const playerLevels = activeGame.state.playerLevels;
      const maxLevelCount = activeGame.levels.length;
      const playerIdList = activeGame.players;
      const hands = activeGame.state.hands;
      const piles = activeGame.state.piles;
      const aggregate: PlayerOverviewAggregate[] = [];

      for (const playerId of playerIdList) {
        const currentLevelIndex = playerLevels.find(
          (p) => p.playerId === playerId
        )?.currentLevelIndex;
        const hasAchievedLevel = playerLevels.find(
          (p) => p.playerId === playerId
        )?.hasAchievedLevel;
        if (playerId !== state.player.id) {
          aggregate.push({
            playerId,
            isActivePlayer: playerId === activePlayerId,
            currentLevelIndex:
              typeof currentLevelIndex === "undefined" ? -1 : currentLevelIndex,
            maxLevelCount,
            hasAchievedLevel:
              typeof hasAchievedLevel === "undefined"
                ? false
                : hasAchievedLevel,
            currentStep,
            handCardCount: (
              hands.find((h) => h.id === playerId) as CardStackSecret
            ).count,
            discardPile: (piles.find((p) => p.id === playerId) as CardStackOpen)
              .cardIds,
          });
        } else {
          aggregate.push({
            playerId,
            isActivePlayer: playerId === activePlayerId,
            currentLevelIndex:
              typeof currentLevelIndex === "undefined" ? -1 : currentLevelIndex,
            maxLevelCount,
            hasAchievedLevel:
              typeof hasAchievedLevel === "undefined"
                ? false
                : hasAchievedLevel,
            currentStep,
            handCardCount: (
              hands.find((h) => h.id === playerId) as CardStackOpen
            ).cardIds.length,
            discardPile: (piles.find((p) => p.id === playerId) as CardStackOpen)
              .cardIds,
          });
        }
      }
      return aggregate;
    },
    getDrawPileCount(state, getters): number {
      const activeGame =
        state.activeGameId.length > 0 && (getters.getActiveGame as Game);
      if (!activeGame) {
        return 0;
      }
      return (
        activeGame.state.piles.find(
          (p) => p.id === DRAW_PILE_ID
        ) as CardStackSecret
      ).count;
    },
    amIActivePlayer(state, getters): boolean {
      const activeGame =
        state.activeGameId.length > 0 && (getters.getActiveGame as Game);
      if (!activeGame) {
        return false;
      }
      return activeGame.state.activePlayerId === state.player.id;
    },
    getCurrentLevelRules(state, getters): GameRule[] {
      const activeGame =
        state.activeGameId.length > 0 && (getters.getActiveGame as Game);
      if (!activeGame) {
        return [];
      }
      const rules = GameRules;
      const currentLevel: number = getters.myCurrentLevel;
      return rules[currentLevel];
    },
    getCurrentStep(state, getters): number {
      const activeGame =
        state.activeGameId.length > 0 && (getters.getActiveGame as Game);
      if (!activeGame) {
        return -1;
      }

      return activeGame.state.currentStep;
    },
    getCardById(state, getters) {
      return (cardId: string): Card => {
        const activeGame =
          state.activeGameId.length > 0 && (getters.getActiveGame as Game);
        const missingCard: Card = {
          id: "CARD-NOT-FOUND",
          color: "NONE",
          type: CardType.NUMBER,
          value: -1,
        };
        if (!activeGame) {
          return missingCard;
        }
        const card = activeGame.cards.find((c) => c.id === cardId);
        if (typeof card === "undefined") {
          return missingCard;
        }
        return card;
      };
    },
    getCardValue(state, getters) {
      return (cardId: string): number => {
        const activeGame =
          state.activeGameId.length > 0 && (getters.getActiveGame as Game);
        if (!activeGame) {
          return -1;
        }
        const card: Card = getters.getCardById(cardId);
        return card.value;
      };
    },
    getCardColor(state, getters) {
      return (cardId: string): string => {
        const activeGame =
          state.activeGameId.length > 0 && (getters.getActiveGame as Game);
        if (!activeGame) {
          return "NONE";
        }
        const card: Card = getters.getCardById(cardId);
        return card.color;
      };
    },

    getLeaderboard(state): LeaderboardEntry[] {
      return state.leaderboard;
    },
    getPlayerListWithWinner(state, getters) {
      const activeGame =
        state.activeGameId.length > 0 && (getters.getActiveGame as Game);
      if (!activeGame) {
        return [];
      }
      const playerLevels = [...activeGame.state.playerLevels].sort(
        (a, b) => b.currentLevelIndex - a.currentLevelIndex
      );
      return playerLevels.map((pl, i) => {
        if (i === 0) {
          return {
            id: pl.playerId,
            winner: true,
          };
        } else {
          return {
            id: pl.playerId,
            winner: false,
          };
        }
      });
    },
  },
  mutations: {
    abortFulfillment(state) {
      state.cardRowsForFulfillment = [];
      state.tempCardsForFulfillment = [];
    },
    nextFulfillmentPart(state, type: CardRowType) {
      state.cardRowsForFulfillment.push({
        type,
        cardIds: state.tempCardsForFulfillment,
      });
      state.tempCardsForFulfillment = [];
    },
    storeForFulfillment(state, { cardId }) {
      state.tempCardsForFulfillment.push(cardId);
    },
    abortPlayCardStep(state) {
      state.tempCardIdForPlay = "";
    },
    chooseForPlay(state, { cardId }) {
      state.tempCardIdForPlay = cardId;
    },
    deselectCard(state, { cardId }) {
      state.tempCardsForFulfillment = state.tempCardsForFulfillment.filter(
        (s) => s !== cardId
      );
      state.tempCardIdForPlay = "";
    },
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
      localStorage.setItem(
        "player-credentials-invalid",
        JSON.stringify(state.player)
      );
      localStorage.removeItem("player-credentials");
      state.player = {
        name: "",
        id: "",
        secret: "",
      };
    },
    updateGames(state, value: Game[]) {
      state.games = value;
    },
    removeActiveGame(state) {
      state.activeGameId = "";
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
      if (state.overwriteView === "rules") {
        state.overwriteView = "";
      } else {
        state.overwriteView = "rules";
      }
    },
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
        levelSystem: LevelSystem.NORMAL,
      };
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
    updateConnection(state, value: boolean) {
      state.connection = value;
    },
    addToErrorLog(state, value: string) {
      state.errorLog.unshift(value);
    },
    addChatMessage(state, value: ChatResponse) {
      const activeGame = state.games.find((g) => g.id === state.activeGameId);
      activeGame?.chat.push(value);
    },
    updateLeaderboard(state, leaderboard: LeaderboardEntry[]) {
      state.leaderboard = leaderboard;
    },
    switchLeaderboard(state) {
      if (state.overwriteView === "leaderboard") {
        state.overwriteView = "";
      } else {
        state.overwriteView = "leaderboard";
      }
    },
    registerPlayer() {
      /* handled by WebSocketPlugin */
    },
    finalizeGameCreation() {
      /* handled by WebSocketPlugin */
    },
    joinGame() {
      /* handled by WebSocketPlugin */
    },
    sendChatMessage() {
      /* handled by WebSocketPlugin */
    },
    deleteGame() {
      /* handled by WebSocketPlugin */
    },
    leaveGame() {
      /* handled by WebSocketPlugin */
    },
    editPlayerName() {
      /* handled by WebSocketPlugin */
    },
    registerExistingPlayer() {
      /* handled by WebSocketPlugin */
    },
    logout() {
      /* handled by WebSocketPlugin */
    },
    startGame() {
      /* handled by WebSocketPlugin */
    },
    discardCard() {
      /* handled by WebSocketPlugin */
    },
    skipLevelFulfillStep() {
      /* handled by WebSocketPlugin */
    },
    skipPlayCardsStep() {
      /* handled by WebSocketPlugin */
    },
    drawCardFromDrawPile() {
      /* handled by WebSocketPlugin */
    },
    drawCard() {
      /* handled by WebSocketPlugin */
    },
    finishFulfillment() {
      /* handled by WebSocketPlugin */
    },
    playCard() {
      /* handled by WebSocketPlugin */
    },
    getLeaderboard() {
      /* handled by WebSocketPlugin */
    },
  },
  plugins: [WebSocketPlugin(socket)],
});
