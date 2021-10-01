<template>
  <form>
    <label for="playerName">
      Your Name
      <input
        type="text"
        :value="playerName"
        @input="updatePlayerName"
        name="playerName"
        id="playerName"
      />
    </label>
    <button v-if="registered" @click="update">Update</button>
    <button v-else @click="register">Register</button>
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
    const register = (e: any) => {
      e.preventDefault();
      store.commit("registerPlayer");
    };
    const registered = computed(
      () => store.state.player.secret.trim().length > 0
    );
    const update = (e: any) => {
      e.preventDefault();
      store.commit("editPlayerName");
    };
    return { playerName, updatePlayerName, register, update, registered };
  },
});
</script>
