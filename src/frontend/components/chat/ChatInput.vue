<template>
  <form>
    <input type="text" :value="message" @input="updateMessage" />
    <button @click.prevent="sendChatMessage">
      <i class="far fa-paper-plane"></i>
    </button>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

export default defineComponent({
  name: "ChatInput",
  setup() {
    const store = useStore(key);
    const message = ref("");
    const updateMessage = (e: any) => {
      message.value = e.target.value;
    };
    const sendChatMessage = (e: Event) => {
      store.commit("sendChatMessage", message.value);
      message.value = "";
    };

    return {
      message,
      updateMessage,
      sendChatMessage,
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
