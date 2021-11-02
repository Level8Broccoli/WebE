<template>
  <main>
    {{ i18n.drawPile }}
    <BackPileView :count="drawPileCount" :isDrawPile="true" />
  </main>
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
