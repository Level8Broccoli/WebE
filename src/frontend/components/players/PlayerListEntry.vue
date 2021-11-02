
<template>
  <div :class="
    isCreator ? 'entry is-creator' : isEmpty ? 'entry is-empty' : 'entry'
  ">
    <span v-if="isEmpty">{{ i18n.playerPlaceholder }}</span>
    <span v-else>{{ playerName }}</span>
    <span v-if="isCreator">
      <i class="far fa-stars"></i>
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

type Props = {
  playerId?: string;
  creatorId?: string;
  isEmpty?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  playerId: "",
  creatorId: "",
  isEmpty: false,
});

const store = useStore(key);
const playerName = computed(
  () => store.getters.getPlayerName(props.playerId) || props.playerId
);
const isCreator = computed(
  () => !props.isEmpty && props.playerId === props.creatorId
);
const i18n = computed(() => store.getters.i18n);
const isEmpty = computed(() => props.isEmpty);
</script>

<style scoped>
.entry {
  display: flex;
  justify-content: space-between;

  border-radius: 0.375em;
  background-color: #dbdbdb;
  padding: 1rem;
  color: #363636;
}

.is-creator {
  background-color: #e5a5ff;
}

.is-empty {
  background-color: transparent;
  border: 1px solid #dbdbdb;
  color: #dbdbdb;
  font-style: italic;
}
</style>
