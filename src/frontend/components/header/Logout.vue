<template>
  <a href="#" @click.prevent="logout">{{ i18n.logout }}</a>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

const store = useStore(key);
const logout = () => {
  store.commit("logout");
};
const i18n = computed(() => store.getters.i18n);
</script>
