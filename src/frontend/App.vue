<template>
  <main class="main-grid">
    <Header>
      <Title v-if="view !== 'start'" />
    </Header>
    <RulesView v-if="view === 'rules'" />
    <StartView v-if="view === 'start'" />
    <GameCreateView v-if="view === 'create-game'" />
    <GameSearchView v-if="view === 'game-search'" />
  </main>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import Header from "./components/header/Header.vue";
import Title from "./components/Title.vue";
import { key } from "./store/store";
import GameCreateView from "./views/GameCreateView.vue";
import GameSearchView from "./views/GameSearchView.vue";
import RulesView from "./views/RulesView.vue";
import StartView from "./views/StartView.vue";

export default defineComponent({
  name: "App",
  components: {
    StartView,
    GameSearchView,
    Header,
    Title,
    RulesView,
    GameCreateView,
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
