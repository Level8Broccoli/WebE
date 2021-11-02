<template>
  <form>
    <label for="playerName">{{ i18n.labelChoosePlayerName }}:</label>
    <input
      type="text"
      :value="playerName"
      @input="updatePlayerName"
      name="playerName"
      id="playerName"
    />
    <button @click.prevent="register">
      {{ i18n.buttonRegisterPlayerName }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";

const store = useStore(key);
const playerName = computed(() => store.state.player.name);
const updatePlayerName = (e: Event) => {
  store.commit("updatePlayerName", (e.target as HTMLInputElement).value);
};
const register = () => {
  store.commit("registerPlayer");
};
const i18n = computed(() => store.getters.i18n);
</script>

<style scoped>
form {
  display: grid;
  grid-template-columns: 1fr max-content;
}
label {
  grid-column: 1 / -1;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 2em;
  font-weight: 900;
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
