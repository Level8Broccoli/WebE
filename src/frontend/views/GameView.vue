<template>
  <section>
    <div class="left">
      <TheGame />
    </div>
    <div class="right">
      <Chat />
    </div>
    <InGameButtons />
  </section>
</template>

<script setup lang="ts">
import Chat from "../components/chat/Chat.vue";
import InGameButtons from "../components/in-game/InGameButtons.vue";
import TheGame from "../components/in-game/TheGame.vue";
</script>

<style scoped>
section {
  display: grid;
  grid-template-columns: 4fr 2fr;
  grid-template-rows: 1fr max-content;
  gap: 2rem;
}

.left {
  height: 100%;
  display: grid;
  grid-template-rows: 1fr;
  max-height: 75vh;
  position: relative;
}

.right {
  height: 100%;
  display: grid;
  grid-template-rows: max-content 1fr;
  max-height: 75vh;
}
</style>
