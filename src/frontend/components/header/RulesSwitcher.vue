<template>
  <a v-if="!isShowingRules" href="#" @click.prevent="switchRules">{{
    showRulesLabel
  }}</a>
  <a v-else href="#" @click.prevent="switchRules">
    {{ closeRulesLabel }}
  </a>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

export default defineComponent({
  name: "RulesSwitcher",
  setup() {
    const store = useStore(key);
    const isShowingRules = computed(() => store.state.showRules);
    const switchRules = (e: Event) => {
      store.commit("switchRules");
    };
    const showRulesLabel = computed(() => store.getters.i18n.showRulesLabel);
    const closeRulesLabel = computed(() => store.getters.i18n.closeRulesLabel);

    return {
      isShowingRules,
      showRulesLabel,
      switchRules,
      closeRulesLabel,
    };
  },
});
</script>
