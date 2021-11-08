<template>
  <section>
    <CreateGameButton />
    <hr />
    <GameList />
  </section>
</template>

<script setup lang="ts">
import CreateGameButton from "../components/games/CreateGameButton.vue";
import GameList from "../components/games/GameList.vue";
</script>
