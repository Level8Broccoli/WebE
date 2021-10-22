<template>
  <a v-if="isEnglish" href="#" @click="switchLanguage">Deutsch</a>
  <a v-else href="#" @click="switchLanguage">English</a>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { Language } from "../i18n/i18n";
import { key } from "../store/store";

export default defineComponent({
  name: "LanguageSwitcher",
  setup() {
    const store = useStore(key);
    const language = computed(() => store.state.language);
    const isEnglish = computed(() => language.value == Language.ENGLISH);
    const switchLanguage = (e: Event) => {
      e.preventDefault();
      store.commit("switchLanguage");
    };

    return {
      isEnglish,
      switchLanguage,
    };
  },
});
</script>

<style scoped>
a {
  color: black;
  position: absolute;
  top: 2rem;
  right: 2rem;
}

a:hover,
a:target {
  color: white;
  text-decoration: none;
}
</style>
