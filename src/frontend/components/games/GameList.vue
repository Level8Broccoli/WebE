<template>
  <ul v-if="games && games.length > 0" role="list">
    <li v-for="game in games" :key="game.id">
      <GameListEntry :game="game" />
    </li>
  </ul>
  <div v-else class="no-games">{{ i18n.noGames }}</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";
import GameListEntry from "./GameListEntry.vue";

const store = useStore(key);
const i18n = computed(() => store.getters.i18n);
const games = computed(() => store.state.games);
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
