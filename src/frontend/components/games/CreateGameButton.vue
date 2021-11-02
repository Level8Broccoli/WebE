<template>
  <button @click.prevent="createNewGame" class="createNewGame">
    {{ i18n.createNewGameButtonLabel }}
    <i class="far fa-long-arrow-right icon-right"></i>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

const store = useStore(key);
const createNewGame = () => {
  store.commit("initNewGame");
};
const i18n = computed(() => store.getters.i18n);
</script>

<style scoped>
.createNewGame {
  width: 100%;
}
</style>
