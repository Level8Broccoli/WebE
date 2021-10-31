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

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import Chat from "../components/chat/Chat.vue";
import GameListEntry from "../components/games/GameListEntry.vue";
import InGameButtons from "../components/in-game/InGameButtons.vue";
import TheGame from "../components/in-game/TheGame.vue";
import PlayerList from "../components/players/PlayerList.vue";
import { key } from "../store/store";

export default defineComponent({
  name: "GameView",
  setup() {
    const store = useStore(key);
    const game = computed(() => store.getters.getActiveGame);
    return { game };
  },
  components: {
    GameListEntry,
    PlayerList,
    InGameButtons,
    TheGame,
    Chat,
  },
});
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
