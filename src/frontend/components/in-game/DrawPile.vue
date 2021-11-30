<template>
  <li>
    <p>
      {{ i18n.drawPile }}
    </p>
    <BackPileView :count="drawPileCount" :isDrawPile="true" />
  </li>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";
import BackPileView from "./BackPileView.vue";

const store = useStore(key);
const drawPileCount: ComputedRef<number> = computed(() => {
  return store.getters.getDrawPileCount;
});
const i18n = computed(() => store.getters.i18n);
</script>

<style scoped>
li {
  display: grid;
  grid-template-rows: 1fr max-content;
  padding: 1rem;
}

p {
  color: black;
  font-weight: bold;
}
</style>
