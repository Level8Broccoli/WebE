<template>
  <main class="the-game">
    <MyHand />
    <PlayerOverviewList />
    <DrawPile />
    <NextStep />
    <ShowLevels />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DrawPile from "./DrawPile.vue";
import MyHand from "./MyHand.vue";
import PlayerOverviewList from "./PlayerOverviewList.vue";
import NextStep from "./NextStep.vue";
import ShowLevels from "./ShowLevels.vue";

export default defineComponent({
  name: "TheGame",
  components: {
    MyHand,
    PlayerOverviewList,
    DrawPile,
    NextStep,
    ShowLevels,
  },
});
</script>

<style scoped>
.the-game {
  border-radius: 0.375em;
  border: 1px solid #dbdbdb;
  background-color: rgb(219, 219, 219, 0.3);
}
</style>
