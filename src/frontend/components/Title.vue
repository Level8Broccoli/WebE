<template>
  <header>
    <h1>Level <span>8</span> Game</h1>
    <small>{{ i18n.authors }}</small>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";

const store = useStore(key);
const i18n = computed(() => store.getters.i18n);
</script>


<style scoped>
header {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  align-items: center;
  text-align: center;
  font-size: 2em;
}

small {
  font-weight: 300;
  color: #ff6464;
  text-align: center;
}
@media (min-width: 800px) {
  header {
    grid-template-columns: max-content 1fr;
    gap: 2.5rem;
  }

  small {
    text-align: left;
  }
}
</style>
