<template>
  <a v-if="isEnglish" href="#" @click.prevent="switchLanguage">Deutsch</a>
  <a v-else href="#" @click.prevent="switchLanguage">English</a>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { Language } from "../../i18n/i18n";
import { key } from "../../store/store";

const store = useStore(key);
const language = computed(() => store.state.language);
const isEnglish = computed(() => language.value == Language.ENGLISH);
const switchLanguage = () => {
  store.commit("switchLanguage");
};
</script>
