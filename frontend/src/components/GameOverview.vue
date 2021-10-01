<template>
  <div>
    <h2>My Game</h2>
    <pre>{{ game }}</pre>
    <button @click="deleteGame">Delete Game</button>
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
    return { game, deleteGame };
  },
});
</script>
