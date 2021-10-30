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
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";
import GameMeta from "../components/games/GameMeta.vue";
import PlayerList from "../components/games/PlayerList.vue";

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
