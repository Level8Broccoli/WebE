<template>
  <div :class="'entry ' + (isActivePlayer ? 'is-active' : '')">
    <p>
      <span class="bold">
        {{ playerName }}
      </span>
      <span class="left-margin"> (Level {{ currentLevelIndex + 1 }}) </span>
      <span class="hasLevelFulfilled" v-if="hasAchievedLevel">
        <i class="fas fa-check"></i>
      </span>
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
import { PlayerOverviewAggregate } from "../../../shared/model/Game";
import { key } from "../../store/store";
import BackPileView from "./BackPileView.vue";
import CardView from "./CardView.vue";
import EmptyPileView from "./EmptyPileView.vue";

type Props = {
  player: PlayerOverviewAggregate;
};
const props = defineProps<Props>();

const store = useStore(key);
const playerId = computed(() => props.player.playerId);
const playerName: ComputedRef<string> = computed(
  () => store.getters.getPlayerName(playerId.value) || playerId.value
);
const isActivePlayer = computed(() => props.player.isActivePlayer);
const handCount = computed(() => props.player.handCardCount);
const i18n = computed(() => store.getters.i18n);

const hasAchievedLevel = computed(() => props.player.hasAchievedLevel);
const currentLevelIndex = computed(() => props.player.currentLevelIndex);

const currentStep: ComputedRef<string> = computed(() =>
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
  padding: 1rem;
}

p {
  grid-area: name;
  color: black;
}

.bold {
  font-weight: bold;
}

.is-active {
  background-color: hsl(253, 65%, 51%, 0.3);
  border-radius: 0.375em;
}

span:not(.bold):not(.left-margin) {
  font-style: italic;
}

.left-margin {
  margin-left: 0.5rem;
}
.is-active .bold {
  color: #5432d3;
}

.hasLevelFulfilled {
  margin-left: 0.5rem;
  color: green;
}
</style>
