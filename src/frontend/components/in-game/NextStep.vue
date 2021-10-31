<template>
  <span v-if="isActivePlayer">{{ currentStep }}</span>
  <span v-else>{{ i18n.stepWaiting }}</span>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

export default defineComponent({
  name: "NextStep",
  setup() {
    const store = useStore(key);
    const isActivePlayer = computed(() => store.getters.amIActivePlayer);
    const i18n = computed(() => store.getters.i18n);
    const currentStep = computed(() =>
      store.getters.translateCurrentStep(store.getters.getCurrentStep)
    );
    return {
      isActivePlayer,
      currentStep,
      i18n,
    };
  },
});
</script>
