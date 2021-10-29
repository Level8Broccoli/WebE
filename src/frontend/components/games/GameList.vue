
<template>
  <ul v-if="games && games.length > 0">
    <li v-for="game in games" :key="game.id">
      {{ game.id }}
    </li>
  </ul>
  <div v-else class="no-games">{{ noGames }}</div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import CreateGame from "../../components/games/CreateGame.vue";
import { key } from "../../store/store";

export default defineComponent({
  name: "GameList",
  components: {
    CreateGame,
  },
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
</style>
