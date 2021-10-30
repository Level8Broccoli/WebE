<template>
  <section>
    <button @click="closeRules">
      <i class="far fa-times icon-left"></i> {{ closeRulesLabel }}
    </button>
    <object
      width="100%"
      height="100%"
      type="application/pdf"
      :data="
        isEnglish
          ? '/frontend/public/game_rules_en.pdf'
          : '/frontend/public/game_rules_de.pdf'
      "
    >
      <p>{{ pdfErrorMessage }}</p>
    </object>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { Language } from "../i18n/i18n";
import { key } from "../store/store";

export default defineComponent({
  name: "RulesView",
  setup() {
    const store = useStore(key);
    const language = computed(() => store.state.language);
    const isEnglish = computed(() => language.value == Language.ENGLISH);
    const i18n = computed(() => store.getters.i18n);
    const pdfErrorMessage = computed(() => i18n.value.pdfErrorMessage);
    const closeRulesLabel = computed(() => i18n.value.closeRulesLabel);
    const closeRules = (e: Event) => {
      store.commit("switchRules");
    };
    return {
      isEnglish,
      pdfErrorMessage,
      closeRulesLabel,
      closeRules,
    };
  },
});
</script>

<style scoped>
button {
  margin-bottom: 1rem;
}
</style>
