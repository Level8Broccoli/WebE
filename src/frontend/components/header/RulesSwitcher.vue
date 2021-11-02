<template>
  <a href="#" @click.prevent="switchRules">{{ i18n.rulesMenuLabel }}</a>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

const store = useStore(key);
const switchRules = () => {
  store.commit("switchRules");
};
const i18n = computed(() => store.getters.i18n);
</script>
