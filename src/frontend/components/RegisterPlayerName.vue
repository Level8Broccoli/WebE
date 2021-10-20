<template>
  <form>
    <label for="playerName"> Choose your player name: </label>
    <input
      type="text"
      :value="playerName"
      @input="updatePlayerName"
      name="playerName"
      id="playerName"
    />
    <button @click="register">Register</button>
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
    return {
      playerName,
      updatePlayerName,
      register,
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
