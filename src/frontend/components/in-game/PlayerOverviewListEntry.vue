<template>
  <div :class="'entry ' + (isActivePlayer ? 'is-active' : '')">
    <p>
      {{ playerName }} || Level: {{ currentLevelIndex + 1 }}/{{ maxLevelCount }}
      || Done:
      {{ hasAchievedLevel ? "YES" : "NO" }}
      <br />
      <span v-if="isActivePlayer">{{ currentStep }}</span>
      <span v-else>{{ i18n.stepWaiting }}</span>
    </p>
    <BackPileView :count="handCount" />
    <CardView
      v-for="cardId in discardPile"
      :key="cardId"
      :id="cardId"
      :isDiscard="true"
      :owner="playerId"
    />
    <EmptyPileView v-if="discardPile.length === 0" />
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import { useStore } from "vuex";
import {
PlayerOverviewAggregate
} from "../../../shared/model/Game";
import { key } from "../../store/store";
import BackPileView from "./BackPileView.vue";
import CardView from "./CardView.vue";
import EmptyPileView from "./EmptyPileView.vue";

type Props = {
  player: PlayerOverviewAggregate;
}
const props = defineProps<Props>();

const store = useStore(key);
const playerId = computed(() => props.player.playerId);
const playerName: ComputedRef<string> = computed(
  () => store.getters.getPlayerName(playerId.value) || playerId.value
);
const isActivePlayer = computed(() => props.player.isActivePlayer);
const currentLevelIndex = computed(() => props.player.currentLevelIndex);
const hasAchievedLevel = computed(() => props.player.hasAchievedLevel);
const maxLevelCount = computed(() => props.player.maxLevelCount);
const handCount = computed(() => props.player.handCardCount);
const i18n = computed(() => store.getters.i18n);

const currentStep:ComputedRef<string> = computed(() =>
  store.getters.translateCurrentStep(props.player.currentStep)
);
const discardPile = computed(() => props.player.discardPile);
</script>

<style scoped>
.entry {
  display: grid;
  grid-template:
    "name name" max-content
    "hand discard" max-content
    / max-content max-content;
  gap: 0.5rem;
}

p {
  grid-area: name;
}

.is-active {
  border: 1px solid #5432d3;
}
</style>
