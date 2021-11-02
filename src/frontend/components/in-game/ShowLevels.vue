<template>
  <ul role="list">
    <li
      v-for="(level, i) in levels"
      :key="i"
      :class="i === myCurrentLevel ? 'current-level' : ''"
    >{{ level }}</li>
  </ul>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

const store = useStore(key);
const levels: ComputedRef<string[]> = computed(() => store.getters.getTranslatedLevels);
const myCurrentLevel: ComputedRef<number> = computed(() => store.getters.myCurrentLevel);
</script>

<style scoped>
ul {
  padding: 0;
}
.current-level {
  color: #241e92;
}
</style>
