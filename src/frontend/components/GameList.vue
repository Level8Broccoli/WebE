<template>
  <div>
    <h2>Game List</h2>
    <ul>
      <li v-for="game in games" :key="game.id">
        <ul>
          <li>ID: {{ game.id }}</li>
          <li>
            Players: {{ game.players.length }} /
            {{ game.config.maxPlayerCount }}
          </li>
          <li>Creator: {{ game.creatorId }}</li>
          <li><button @click="() => joinGame(game.id)">Join Game</button></li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";

export default defineComponent({
  name: "GameList",
  setup() {
    const store = useStore(key);
    const games = computed(() => store.state.games);
    const joinGame = (id: string) => {
      store.commit("joinGame", id);
    };
    return { games, joinGame };
  },
});
</script>
