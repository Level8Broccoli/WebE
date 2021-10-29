
<template>
  <section>
    <CreateGameButton />
    <GameList />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CreateGameButton from "../components/games/CreateGameButton.vue";
import GameList from "../components/games/GameList.vue";

export default defineComponent({
  name: "GameSearchView",
  components: {
    CreateGameButton,
    GameList,
  },
});
</script>
