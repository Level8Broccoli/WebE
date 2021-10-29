<template>
  <a v-if="!isEdit" href="#" @click.prevent="switchToEdit">{{ playerName }}</a>
  <form v-else>
    <input @input="updatePlayerName" type="text" :value="playerName" />
    <button @click.prevent="sendUpdate">{{ button }}</button>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";

export default defineComponent({
  name: "PlayerName",
  setup() {
    const store = useStore(key);
    const playerName = computed(() => store.state.player.name);
    const isEdit = ref(false);
    const switchToEdit = (e: Event) => {
      isEdit.value = true;
    };
    const sendUpdate = (e: Event) => {
      isEdit.value = false;
      store.commit("editPlayerName");
    };
    const updatePlayerName = (e: any) => {
      store.commit("updatePlayerName", e.target.value);
    };
    const i18n = computed(() => store.getters.i18n);
    const button = computed(() => i18n.value.buttonUpdatePlayerName);
    return {
      isEdit,
      playerName,
      updatePlayerName,
      switchToEdit,
      button,
      sendUpdate,
    };
  },
});
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
