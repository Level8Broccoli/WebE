<template>
  <form>
    <label for="maxPlayerCount">
      Max Player Count
      <input
        type="number"
        :value="maxPlayerCount"
        @input="updateMaxPlayerCount"
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
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";

export default defineComponent({
  name: "CreateGame",
  setup() {
    const store = useStore(key);
    const maxPlayerCount = store.state.maxPlayerCount;
    const updateMaxPlayerCount = (e: any) => {
      store.commit("updateMaxPlayerCount", Number(e.target.value));
    };
    const submit = (e: any) => {
      e.preventDefault();
      store.commit("createGame");
    };
    return { maxPlayerCount, updateMaxPlayerCount, submit };
  },
});
</script>
