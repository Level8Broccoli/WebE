<template>
  <main class="the-game">
    <MyHand />
    <PlayerOverviewList />
    <DrawPile />
    <GameBoard />
    <NextStep />
    <ShowLevels />
  </main>
</template>

<script setup lang="ts">
import DrawPile from "./DrawPile.vue";
import GameBoard from "./GameBoard.vue";
import MyHand from "./MyHand.vue";
import NextStep from "./NextStep.vue";
import PlayerOverviewList from "./PlayerOverviewList.vue";
import ShowLevels from "./ShowLevels.vue";
</script>

<style scoped>
.the-game {
  border-radius: 0.375em;
  border: 1px solid #dbdbdb;
  background-color: rgb(219, 219, 219, 0.3);
}
</style>
