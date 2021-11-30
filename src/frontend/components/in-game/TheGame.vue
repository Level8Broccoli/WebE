<template>
  <main class="the-game">
    <PlayerOverviewList />
    <DrawPile />
    <GameBoard />
    <footer>
      <MyHand :fulfillLevelMode="fulfillLevelMode" />
      <NextStep
        :fulfillLevelMode="fulfillLevelMode"
        :setFulfillLevelMode="setFulfillLevelMode"
      />
      <ShowLevels />
    </footer>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import DrawPile from "./DrawPile.vue";
import GameBoard from "./GameBoard.vue";
import MyHand from "./MyHand.vue";
import NextStep from "./NextStep.vue";
import PlayerOverviewList from "./PlayerOverviewList.vue";
import ShowLevels from "./ShowLevels.vue";

const fulfillLevelMode = ref(false);
const setFulfillLevelMode = (bool: boolean) => {
  fulfillLevelMode.value = bool;
};
</script>

<style scoped>
.the-game {
  border-radius: 0.375em;
  border: 1px solid #dbdbdb;
  background-color: rgb(219, 219, 219, 0.3);
  overflow-y: auto;
}

footer {
  position: absolute;
  bottom: 1px;
  left: 1px;
  right: 1px;
}
</style>
