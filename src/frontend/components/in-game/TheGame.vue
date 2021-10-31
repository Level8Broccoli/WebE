<template>
  <main class="the-game">
    <MyHand />
    <OtherPlayers />
    <DrawPile />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DrawPile from "./DrawPile.vue";
import MyHand from "./MyHand.vue";
import OtherPlayers from "./PlayerOverviewList.vue";

export default defineComponent({
  name: "TheGame",
  components: {
    MyHand,
    OtherPlayers,
    DrawPile,
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
