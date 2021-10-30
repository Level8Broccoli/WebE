
<template>
  <ul v-if="games && games.length > 0" role="list">
    <li v-for="game in games" :key="game.id">
      <GameListEntry :game="game" />
    </li>
  </ul>
  <div v-else class="no-games">{{ noGames }}</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";
import GameListEntry from "./GameListEntry.vue";

export default defineComponent({
  name: "GameList",
  components: { GameListEntry },
  setup() {
    const store = useStore(key);
    const i18n = computed(() => store.getters.i18n);
    const noGames = computed(() => i18n.value.noGames);
    const games = computed(() => store.state.games);
    return {
      games,
      noGames,
    };
  },
});
</script>

<style scoped>
.no-games {
  text-align: center;
  margin-top: 2rem;
  font-style: italic;
}

ul {
  padding: 0;
  margin: 0;
  margin-top: 1rem;
}

li + li {
  margin-top: 1rem;
}
</style>
