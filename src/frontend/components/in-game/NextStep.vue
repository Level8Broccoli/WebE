<template>
  <div :class="(isActivePlayer ? 'is-active' : 'is-waiting') + ' steps'">
    <div v-if="isActivePlayer">
      <div class="main-message">
        {{ i18n.yourTurn }}
        {{ currentStep }}.
      </div>
      <div>
        <em>{{ currentStepExplanation }}</em>
      </div>
    </div>
    <div v-else>
      <div class="main-message">
        {{ i18n.pleaseWaitOnPlayer }}
      </div>
      <div>
        <em>{{ currentPlayerName }}</em>
        ({{ currentStep }})
      </div>
    </div>
    <div class="buttons">
      <button
        v-if="isInLevelFulfillStep && !fulfillLevelMode"
        @click.prevent="startFulfillingLevel"
      >
        <i class="far fa-check icon-left"></i>
        {{ i18n.startFulfillingLevel }}
      </button>
      <button v-if="fulfillLevelMode" @click.prevent="abortFulfillment">
        <i class="far fa-times icon-left"></i>
        {{ i18n.abortButton }}
      </button>
      <button
        v-if="fulfillLevelMode && valid && !isLastPart"
        @click.prevent="nextFulfillmentPart"
      >
        <i class="far fa-check icon-left"></i>
        {{ i18n.nextStep }}
      </button>
      <button
        v-if="fulfillLevelMode && valid && isLastPart"
        @click.prevent="finishFulfillment"
      >
        <i class="far fa-check icon-left"></i>
        {{ i18n.finishFulfillment }}
      </button>
      <button v-if="fulfillLevelMode && !valid" class="is-disabled">
        <i class="fas fa-exclamation-circle icon-left"></i>
        {{ i18n.notYetValid }}
      </button>
      <button v-if="isInLevelFulfillStep" @click.prevent="skipLevelFulfillStep">
        <i class="far fa-arrow-to-right icon-left"></i>
        {{ i18n.skipStep }}
      </button>
      <button v-if="isInPlayCardStep" @click.prevent="skipPlayCardsStep">
        <i class="far fa-arrow-to-right icon-left"></i>
        {{ i18n.skipStep }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref } from "vue";
import { useStore } from "vuex";
import { CardRowType, Game, GameRule } from "../../../shared/model/Game";
import { key } from "../../store/store";

type Props = {
  fulfillLevelMode: boolean;
  setFulfillLevelMode: (value: boolean) => void;
};
const props = defineProps<Props>();

const store = useStore(key);
const isActivePlayer = computed(() => store.getters.amIActivePlayer);
const i18n = computed(() => store.getters.i18n);
const currentStep = computed(() =>
  store.getters.translateCurrentStep(store.getters.getCurrentStep)
);
const currentStepExplanation: ComputedRef<string> = computed(() =>
  store.getters.translateCurrentStepExplanation(store.getters.getCurrentStep)
);
const currentPlayerName: ComputedRef<string> = computed(() => {
  const game: Game = store.getters.getActiveGame;
  const activePlayerId = game.state.activePlayerId;
  return store.getters.getPlayerName(activePlayerId) || activePlayerId;
});

const fulfillLevelCounter = ref(0);

const currentLevelRules: ComputedRef<GameRule[]> = computed(
  () => store.getters.getCurrentLevelRules
);
const currentFulfillLevelPart = computed(
  () => currentLevelRules.value[fulfillLevelCounter.value]
);

const skipLevelFulfillStep = () => {
  fulfillLevelCounter.value = 0;
  props.setFulfillLevelMode(false);
  store.commit("abortFulfillment");
  store.commit("skipLevelFulfillStep");
};
const skipPlayCardsStep = () => {
  store.commit("abortPlayCardStep");
  store.commit("skipPlayCardsStep");
};
const isInLevelFulfillStep: ComputedRef<boolean> = computed(
  () => isActivePlayer.value && store.getters.getCurrentStep === 1
);
const isInPlayCardStep: ComputedRef<boolean> = computed(
  () => isActivePlayer.value && store.getters.getCurrentStep === 2
);
const startFulfillingLevel = () => {
  props.setFulfillLevelMode(true);
};
const valid = computed(() => {
  const rulePart = currentFulfillLevelPart.value;
  const temp = store.state.tempCardsForFulfillment;
  if (temp.length !== rulePart.count) {
    return false;
  }
  if (rulePart.type === CardRowType.STREET) {
    const cardValues: number[] = [];
    for (const cardId of temp) {
      const cardValue: number = store.getters.getCardValue(cardId);
      cardValues.push(cardValue);
    }
    cardValues.sort((a, b) => a - b);
    for (let i = 0; i < cardValues.length - 1; i++) {
      const curr = cardValues[i];
      const next = cardValues[i + 1];
      if (curr + 1 !== next) {
        return false;
      }
    }
  }
  if (rulePart.type === CardRowType.SAME_NUMBER) {
    const cardValues: number[] = [];
    for (const cardId of temp) {
      const cardValue: number = store.getters.getCardValue(cardId);
      cardValues.push(cardValue);
    }
    for (let i = 0; i < cardValues.length - 1; i++) {
      const curr = cardValues[i];
      const next = cardValues[i + 1];
      if (curr !== next) {
        return false;
      }
    }
  }
  if (rulePart.type === CardRowType.SAME_COLOR) {
    const cardColors: string[] = [];
    for (const cardId of temp) {
      const cardValue: string = store.getters.getCardColor(cardId);
      cardColors.push(cardValue);
    }
    for (let i = 0; i < cardColors.length - 1; i++) {
      const curr = cardColors[i];
      const next = cardColors[i + 1];
      if (curr !== next) {
        return false;
      }
      if (curr === "NONE") {
        return false;
      }
    }
  }
  return true;
});
const abortFulfillment = () => {
  fulfillLevelCounter.value = 0;
  props.setFulfillLevelMode(false);
  store.commit("abortFulfillment");
};
const nextFulfillmentPart = () => {
  store.commit("nextFulfillmentPart", currentFulfillLevelPart.value.type);
  fulfillLevelCounter.value = fulfillLevelCounter.value + 1;
};
const finishFulfillment = () => {
  store.commit("nextFulfillmentPart", currentFulfillLevelPart.value.type);
  fulfillLevelCounter.value = 0;
  props.setFulfillLevelMode(false);
  store.commit("finishFulfillment");
};
const isLastPart = computed(
  () => fulfillLevelCounter.value + 1 === currentLevelRules.value.length
);
</script>

<style scoped>
.main-message {
  font-weight: bold;
}
.steps {
  padding: 1rem;
  text-align: center;
}

.is-waiting {
  background-color: rgb(114, 114, 112, 0.65);
}

.is-active {
  background-color: rgb(255, 100, 100, 0.65);
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

button {
  margin-top: 1rem;
}
</style>
