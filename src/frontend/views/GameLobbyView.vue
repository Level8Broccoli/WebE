<template>
  <section>
    <div class="left">
      <GameListEntry :game="game" :joinButton="false" />
      <div><hr /></div>
      <PlayerList />
      <LobbyButtons />
    </div>
    <div class="right">
      <Chat />
    </div>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";
import GameListEntry from "../components/games/GameListEntry.vue";
import LobbyButtons from "../components/lobby/LobbyButtons.vue";
import PlayerList from "../components/players/PlayerList.vue";
import Chat from "../components/chat/Chat.vue";

export default defineComponent({
  name: "GameLobbyView",
  setup() {
    const store = useStore(key);
    const game = computed(() => store.getters.getActiveGame);
    return { game };
  },
  components: {
    GameListEntry,
    PlayerList,
    LobbyButtons,
    Chat,
  },
});
</script>
<style scoped>
section {
  display: grid;
  grid-template-columns: 4fr 2fr;
  gap: 1rem;
}

.left {
  display: grid;
  grid-template-rows: max-content max-content 1fr max-content;
}
</style>
