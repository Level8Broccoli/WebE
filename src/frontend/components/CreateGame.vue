<template>
  <form>
    <label for="maxPlayerCount">
      Max Player Count
      <input
        type="number"
        v-model="maxPlayerCount"
        name="maxPlayerCount"
        min="2"
        max="4"
        id="maxPlayerCount"
      />
    </label>
    <button type="submit" @click="submit">Create Game</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";

export default defineComponent({
  name: "CreateGame",
  setup() {
    const store = useStore(key);
    const maxPlayerCount = ref(4);
    const submit = (e: any) => {
      e.preventDefault();
      store.commit("createGame", maxPlayerCount.value);
    };
    return { maxPlayerCount, submit };
  },
});
</script>
