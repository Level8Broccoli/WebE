<template>
  <div>
    <h1>Level 8 Game</h1>
    <PlayerName />
    <hr />
    <StoreOutput />
    <small>by Thierry and Oliver</small>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PlayerName from "./components/PlayerName.vue";
import StoreOutput from "./components/StoreOutput.vue";

export default defineComponent({
  name: "App",
  components: {
    StoreOutput,
    PlayerName,
  },
});
</script>
