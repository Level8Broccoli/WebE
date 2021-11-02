<template>
  <section>
    <div class="left">
      <TheGame />
      <InGameButtons />
    </div>
    <div class="right">
      <Chat />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";
import Chat from "../components/chat/Chat.vue";
import InGameButtons from "../components/in-game/InGameButtons.vue";
import TheGame from "../components/in-game/TheGame.vue";
import PlayerList from "../components/players/PlayerList.vue";

const store = useStore(key);
const game = computed(() => store.getters.getActiveGame);
</script>

<style scoped>
section {
  display: grid;
  grid-template-columns: 4fr 2fr;
  gap: 2rem;
}

.left {
  display: grid;
  grid-template-rows: 1fr max-content;
  gap: 2rem;
}
</style>
