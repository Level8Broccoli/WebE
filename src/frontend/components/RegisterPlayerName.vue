<template>
  <form>
    <label for="playerName">{{ label }}:</label>
    <input
      type="text"
      :value="playerName"
      @input="updatePlayerName"
      name="playerName"
      id="playerName"
    />
    <button @click="register">{{ button }}</button>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";

export default defineComponent({
  name: "PlayerName",
  setup() {
    const store = useStore(key);
    const playerName = computed(() => store.state.player.name);
    const updatePlayerName = (e: any) => {
      store.commit("updatePlayerName", e.target.value);
    };
    const register = (e: Event) => {
      e.preventDefault();
      store.commit("registerPlayer");
    };
    const i18n = computed(() => store.getters.i18n);
    const label = computed(() => i18n.value.labelChoosePlayerName);
    const button = computed(() => i18n.value.buttonRegisterPlayerName);
    return {
      playerName,
      updatePlayerName,
      register,
      label,
      button,
    };
  },
});
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
