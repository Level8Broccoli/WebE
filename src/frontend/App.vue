<template>
  <main class="main-grid">
    <Header>
      <Title v-if="view !== 'start'" />
    </Header>
    <LeaderboardView v-if="view === 'leaderboard'" />
    <RulesView v-if="view === 'rules'" />
    <StartView v-if="view === 'start'" />
    <GameSearchView v-if="view === 'game-search'" />
    <GameCreateView v-if="view === 'game-in-creation'" />
    <GameLobbyView v-if="view === 'game-in-lobby'" />
    <GameFinishedView v-if="view === 'game-finished'" />
    <GameView v-if="view === 'game-in-progress'" />
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { PrivatePlayer } from "../shared/model/Player";
import Header from "./components/header/Header.vue";
import Title from "./components/Title.vue";
import { key } from "./store/store";
import GameCreateView from "./views/GameCreateView.vue";
import GameSearchView from "./views/GameSearchView.vue";
import RulesView from "./views/RulesView.vue";
import StartView from "./views/StartView.vue";
import GameLobbyView from "./views/GameLobbyView.vue";
import GameView from "./views/GameView.vue";
import GameFinishedView from "./views/GameFinishedView.vue";
import LeaderboardView from "./views/LeaderboardView.vue";

export default defineComponent({
  name: "App",
  components: {
    StartView,
    GameSearchView,
    Header,
    GameView,
    GameFinishedView,
    Title,
    RulesView,
    GameCreateView,
    GameLobbyView,
    LeaderboardView,
  },
  mounted() {
    const store = useStore(key);

    function loadLocalStorage() {
      const language = localStorage.getItem("language");
      const playerCredentials = localStorage.getItem("player-credentials");
      if (language !== null && language === "DE") {
        store.commit("switchLanguage");
      }
      if (playerCredentials !== null) {
        const player: PrivatePlayer = JSON.parse(playerCredentials);
        store.commit("updatePlayer", player);
        store.commit("registerExistingPlayer");
      }
    }
    loadLocalStorage();
  },
  setup() {
    const store = useStore(key);
    const view = computed(() => store.getters.view);

    return {
      view,
    };
  },
});
</script>

<style scoped>
.main-grid {
  display: grid;
  min-height: 100vh;
  grid:
    "header" max-content
    "body" 1fr;
  padding: 1rem 2rem;
  gap: 2rem;
}
</style>
