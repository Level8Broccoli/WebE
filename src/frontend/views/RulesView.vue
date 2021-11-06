<template>
  <section>
    <button @click="closeRules">
      <i class="far fa-times icon-left"></i> {{ i18n.closeRulesLabel }}
    </button>
    <object
      width="100%"
      height="100%"
      type="application/pdf"
      :data="
        isEnglish
          ? '/game_rules_en.pdf'
          : '/game_rules_de.pdf'
      "
    >
      <p>{{ i18n.pdfErrorMessage }}</p>
    </object>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { Language } from "../i18n/i18n";
import { key } from "../store/store";

const store = useStore(key);
const language = computed(() => store.state.language);
const isEnglish = computed(() => language.value == Language.ENGLISH);
const i18n = computed(() => store.getters.i18n);
const closeRules = () => {
  store.commit("switchRules");
};
</script>

<style scoped>
button {
  margin-bottom: 1rem;
}
</style>
