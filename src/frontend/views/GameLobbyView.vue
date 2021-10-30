<template>
  <section>
    <div class="left">
      <GameMeta />
      <hr />
      <PlayerList />
      <hr />
      Buttons
    </div>
    <div class="right">Chat</div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import GameMeta from "../components/games/GameMeta.vue";
import PlayerList from "../components/players/PlayerList.vue";

export default defineComponent({
  name: "GameLobbyView",
  components: {
    GameMeta,
    PlayerList,
  },
});
</script>
<style scoped>
section {
  display: grid;
  grid-template-columns: 4fr 2fr;
  gap: 1rem;
}
</style>
