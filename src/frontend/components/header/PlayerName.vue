<template>
  <a v-if="!isEdit" href="#" @click.prevent="switchToEdit">{{ playerName }}</a>
  <form v-else>
    <input @input="updatePlayerName" type="text" :value="playerName" />
    <button @click.prevent="sendUpdate">{{ i18n.buttonUpdatePlayerName }}</button>
  </form>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

const store = useStore(key);
const playerName = computed(() => store.state.player.name);
const isEdit = ref(false);
const switchToEdit = () => {
  isEdit.value = true;
};
const sendUpdate = () => {
  isEdit.value = false;
  store.commit("editPlayerName");
};
const updatePlayerName = (e: Event) => {
  store.commit("updatePlayerName", (e.target as HTMLInputElement).value);
};
const i18n = computed(() => store.getters.i18n);
</script>

<style scoped>
form {
  display: grid;
  grid-template-columns: 1fr max-content;
}
input {
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
}
button {
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}
</style>
