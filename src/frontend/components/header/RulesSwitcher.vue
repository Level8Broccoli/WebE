<template>
  <a href="#" @click.prevent="switchRules">{{
    rulesMenuLabel
  }}</a>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

export default defineComponent({
  name: "RulesSwitcher",
  setup() {
    const store = useStore(key);
    const switchRules = () => {
      store.commit("switchRules");
    };
    const rulesMenuLabel = computed(() => store.getters.i18n.rulesMenuLabel);

    return {
      switchRules,
      rulesMenuLabel
    };
  },
});
</script>
