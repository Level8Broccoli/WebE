<template>
  <div>
    <h2>My Game</h2>
    <pre>{{ game }}</pre>
    <button @click="deleteGame">Delete Game</button>
    <button @click="leaveGame">Leave Game</button>
    <button @click="startGame">Start Game</button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";

export default defineComponent({
  name: "GameOverview",
  setup() {
    const store = useStore(key);
    const game = computed(() => store.state.activeGame);
    const deleteGame = () => store.commit("deleteGame");
    const leaveGame = () => store.commit("leaveGame");
    const startGame = () => store.commit("startGame");
    return { game, deleteGame, leaveGame, startGame };
  },
});
</script>
