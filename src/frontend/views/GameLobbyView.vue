<template>
  <section>
    <div class="left">
      <GameMeta />
      <hr />
      <PlayerList />
      <hr />
      <LobbyButtons />
    </div>
    <div class="right">Chat</div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GameMeta from "../components/lobby/GameMeta.vue";
import PlayerList from "../components/players/PlayerList.vue";
import LobbyButtons from "../components/lobby/LobbyButtons.vue";

export default defineComponent({
  name: "GameLobbyView",
  components: {
    GameMeta,
    PlayerList,
    LobbyButtons,
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
  grid-template-rows: max-content max-content 1fr max-content max-content;
}
</style>
