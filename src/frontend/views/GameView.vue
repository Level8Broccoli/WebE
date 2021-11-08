<template>
  <section>
    <div class="left">
      <TheGame />
      <InGameButtons />
    </div>
    <div class="right">
      <Chat />
    </div>
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
  gap: 2rem;
}

.left {
  display: grid;
  grid-template-rows: 1fr max-content;
  gap: 2rem;
}
</style>
