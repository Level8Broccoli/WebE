<template>
  <section>
    <Title />
    <RegisterPlayerName />
  </section>
</template>

<script setup lang="ts">
import Title from "../components/Title.vue";
import RegisterPlayerName from "../components/RegisterPlayerName.vue";
</script>

<style scoped>
section {
  display: grid;
  place-content: center;
  gap: 5rem;
  padding-bottom: 15vh;
}
</style>
