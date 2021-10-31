<template>
  <main>
    <MyHand />
    <OtherPlayers />
    <DrawPile />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DrawPile from "./DrawPile.vue";
import MyHand from "./MyHand.vue";
import OtherPlayers from "./OtherPlayers.vue";

export default defineComponent({
  name: "TheGame",
  components: {
    MyHand,
    OtherPlayers,
    DrawPile,
  },
});
</script>
