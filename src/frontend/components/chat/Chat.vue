<template>
  <aside>
    <ChatInput />
    <ul role="list">
      <li v-for="message in messageList" :key="String(message.timestamp)">
        <ChatMessage :message="message" />
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { DateTime } from "luxon";
import { computed, ComputedRef } from "vue";
import { useStore } from "vuex";
import { Game } from "../../../shared/model/Game";
import { key } from "../../store/store";
import ChatInput from "./ChatInput.vue";
import ChatMessage from "./ChatMessage.vue";

const store = useStore(key);
const game: ComputedRef<Game> = computed(() => store.getters.getActiveGame);
const messageList = computed(() =>
  [...game.value.chat].sort((a, b) => {
    const aa = DateTime.fromISO(a.timestamp.toString());
    const bb = DateTime.fromISO(b.timestamp.toString());
    return bb.toMillis() - aa.toMillis();
  })
);
</script>

<style scoped>
aside {
  height: 100%;
}

ul {
  padding: 1rem;
  margin: 0;
  margin-top: 1rem;
  border-radius: 0.375em;
  border: 1px solid #dbdbdb;
  background-color: rgb(219, 219, 219, 0.3);
  height: 75vh;
  overflow-y: scroll;
}

li + li {
  margin-top: 1rem;
}
</style>
