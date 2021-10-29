
<template>
  <section>Create your game here</section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CreateGame from "../components/games/CreateGame.vue";
import GameList from "../components/games/GameList.vue";

export default defineComponent({
  name: "GameCreateView",
  components: {
    CreateGame,
    GameList,
  },
});
</script>
