<template>
  <div :class="isMyMessage ? 'my-message message' : 'message'">
    <p>
      <strong> {{ message }} </strong>
    </p>
    {{ authorName }} | {{ timestamp }}
  </div>
</template>

<script setup lang="ts">
import { DateTime } from "luxon";
import { computed, PropType } from "vue";
import { useStore } from "vuex";
import { ChatMessage } from "../../../shared/model/Chat";
import { Language } from "../../i18n/i18n";
import { key } from "../../store/store";

type Props = {
  message: ChatMessage;
};
const props = defineProps<Props>();

const store = useStore(key);
const i18n = computed(() => store.getters.i18n);
const authorName = computed(
  () =>
    store.getters.getPlayerName(props.message.playerId) ||
    i18n.value.playerUnknown
);
const isMyMessage = computed(
  () => props.message.playerId === store.state.player.id
);

const message = computed(() => props.message.message);

const language = computed(() => store.state.language);

const timestamp = computed(() => {
  const locale = language.value === Language.GERMAN ? "de" : "en";
  return DateTime.fromISO(props.message.timestamp.toString())
    .setLocale(locale)
    .toLocaleString(DateTime.DATETIME_SHORT);
});
</script>

<style scoped>
.message {
  background-color: #dbdbdb;
  color: #363636;
  border-radius: 0.375em;
  padding: 0.5rem 1rem;
  margin-right: 2rem;
}
.my-message {
  background-color: #e5a5ff;
  margin-left: 2rem;
  margin-right: 0;
}
</style>
