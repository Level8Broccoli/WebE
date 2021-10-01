<template>
  <form>
    <label for="playerName">
      Your Name
      <input
        type="text"
        :value="playerName"
        @input="updatePlayerName"
        name="playerName"
      />
    </label>
    <button @click="submit">Register</button>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";

export default defineComponent({
  name: "PlayerName",
  setup() {
    const store = useStore(key);
    const playerName = store.state.playerName;
    const updatePlayerName = (e: any) => {
      store.commit("updatePlayerName", e.target.value);
    };
    const submit = (e: any) => {
      e.preventDefault();
      store.commit("registerPlayer");
    };
    return { playerName, updatePlayerName, submit };
  },
});
</script>
