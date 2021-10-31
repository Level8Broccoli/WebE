<template>
  <ul role="list">
    <li
      v-for="(level, i) in levels"
      :key="i"
      :class="i === myCurrentLevel ? 'current-level' : ''"
    >
      {{ level }}
    </li>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

export default defineComponent({
  name: "ShowLevels",
  setup() {
    const store = useStore(key);
    const i18n = computed(() => store.getters.i18n);
    const levels = computed(() => store.getters.getTranslatedLevels);
    const myCurrentLevel = computed(() => store.getters.myCurrentLevel);

    return {
      i18n,
      levels,
      myCurrentLevel,
    };
  },
});
</script>

<style scoped>
ul {
    padding: 0;
}
.current-level {
  color: #241e92;
}
</style>
