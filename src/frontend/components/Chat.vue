<template>
  <div>
    <h2>Chat</h2>
    <ul>
      <li v-for="(msg, i) in chat" :key="i">
        <p><strong>{{ msg.message }}</strong></p>
        <small>From: {{ msg.player.name }}</small>
      </li>
    </ul>
    <form>
      <label for="chatMsg">
        Message:
        <input type="text" v-model="chatMsg" name="chatMsg" id="chatMsg" />
      </label>
      <button type="submit" @click="submit">Send</button>
    </form>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";

export default defineComponent({
  name: "Chat",
  setup() {
    const store = useStore(key);
    const chat = computed(() => store.state.activeGame?.chat || []);
    const chatMsg = ref("");
    const submit = (e: any) => {
      e.preventDefault();
      store.commit("chat", chatMsg.value);
      chatMsg.value = "";
    };
    return { chat, submit, chatMsg };
  },
});
</script>
