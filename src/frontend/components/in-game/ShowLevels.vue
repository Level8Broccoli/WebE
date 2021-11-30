<template>
  <div>
    {{ i18n.currentLevelLabel }}:
    <span class="bold">{{ levels[myCurrentLevel] }}</span>
    <span class="hasLevelFulfilled" v-if="hasLevelFulfilled">
      <i class="fas fa-check"></i>
    </span>
    <span class="hasLevelNotYetFulfilled" v-else>
      <i class="fas fa-times"></i>
    </span>
    <span>
      (Level
      {{ currentLevelIndex + 1 }} / {{ maxLevelCount }})
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

const store = useStore(key);
const i18n = computed(() => store.getters.i18n);

const currentLevelIndex = computed(() => store.getters.myCurrentLevel);
const hasLevelFulfilled: ComputedRef<boolean> = computed(
  () => store.getters.getCurrentPlayerLevel.hasAchievedLevel
);
const maxLevelCount = computed(
  () => store.getters.getActiveGame.config.maxPlayerCount
);
const levels: ComputedRef<string[]> = computed(
  () => store.getters.getTranslatedLevels
);
const myCurrentLevel: ComputedRef<number> = computed(
  () => store.getters.myCurrentLevel
);
</script>

<style scoped>
div {
  background-color: #5432d3;
  padding: 1rem;
  text-align: center;
  border-radius: 0.375em;
}

.bold {
  font-weight: bold;
}

span {
  margin-left: 1rem;
}

.hasLevelFulfilled {
  color: lightgreen;
}

.hasLevelNotYetFulfilled {
  color: red;
}
</style>
