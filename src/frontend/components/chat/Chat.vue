<template>
  <aside>
    <ChatInput />
    <ul role="list">
      <li v-for="message in messageList" :key="message.id">
        {{ message }}
      </li>
    </ul>
  </aside>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";
import ChatInput from "./ChatInput.vue";

export default defineComponent({
  name: "Chat",
  components: { ChatInput },
  setup() {
    const store = useStore(key);
    const i18n = computed(() => store.getters.i18n);
    const game = computed(() => store.getters.getActiveGame);
    const messageList = computed(() => game.value.chat.reverse());
    return {
      i18n,
      messageList,
    };
  },
});
</script>
