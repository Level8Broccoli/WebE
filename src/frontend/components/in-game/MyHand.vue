<template>
  <main class="my-hand">
    <button @click.prevent="switchSorting" v-if="sorting === 'COLOR'">
      <i class="fas fa-sort-shapes-up-alt"></i>
    </button>
    <button @click.prevent="switchSorting" v-if="sorting === 'NUMBER'">
      <i class="fas fa-sort-numeric-up-alt"></i>
    </button>
    <button @click.prevent="switchSorting" v-if="sorting === 'NONE'">
      <i class="fas fa-sort-alt"></i>
    </button>
    <ul role="list">
      <li v-for="cardId in myHand" :key="cardId">
        <CardView
          :id="cardId"
          :isHand="true"
          :isInFulfillmentMode="fulfillLevelMode"
        />
      </li>
    </ul>
    <br />
    <button
      v-if="isInLevelFulfillStep && !fulfillLevelMode"
      @click.prevent="startFulfillingLevel"
    >
      {{ i18n.startFulfillingLevel }}
    </button>
    <button v-if="fulfillLevelMode" @click.prevent="abortFulfillment">
      {{ i18n.abortButton }}
    </button>
    <button
      v-if="fulfillLevelMode && valid && !isLastPart"
      @click.prevent="nextFulfillmentPart"
    >
      {{ i18n.nextStep }}
    </button>
    <button
      v-if="fulfillLevelMode && valid && isLastPart"
      @click.prevent="finishFulfillment"
    >
      {{ i18n.finishFulfillment }}
    </button>
    <button v-if="fulfillLevelMode && !valid" class="is-disabled">
      {{ i18n.notYetValid }}
    </button>
    <button v-if="isInLevelFulfillStep" @click.prevent="skipLevelFulfillStep">
      {{ i18n.skipStep }}
    </button>
    <button v-if="isInPlayCardStep" @click.prevent="skipPlayCardsStep">
      {{ i18n.skipStep }}
    </button>
  </main>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref } from "vue";
import { useStore } from "vuex";
import { Card, CardRowType, GameRule } from "../../../shared/model/Game";
import { key } from "../../store/store";
import CardView from "./CardView.vue";

const store = useStore(key);
const i18n = computed(() => store.getters.i18n);

enum Sorting {
  NONE = "NONE",
  COLOR = "COLOR",
  NUMBER = "NUMBER",
}
const sorting = ref(Sorting.NONE);
const myHand: ComputedRef<string[]> = computed(() => {
  const myHand: string[] = store.getters.getMyHands;
  if (sorting.value === Sorting.NONE) {
    return myHand;
  } else {
    const cards: Card[] = myHand.map((id) => store.getters.getCardById(id));
    if (sorting.value === Sorting.COLOR) {
      return cards
        .sort((a, b) =>
          a.color === b.color
            ? a.value - b.value
            : a.color.localeCompare(b.color)
        )
        .map((c) => c.id);
    } else if (sorting.value === Sorting.NUMBER) {
      return cards.sort((a, b) => a.value - b.value).map((c) => c.id);
    }
  }
  return myHand;
});
const fulfillLevelMode = ref(false);
const fulfillLevelCounter = ref(0);
const switchSorting = () => {
  const newValue =
    sorting.value === Sorting.NONE
      ? Sorting.COLOR
      : sorting.value === Sorting.COLOR
      ? Sorting.NUMBER
      : Sorting.NONE;
  sorting.value = newValue;
};
const currentLevelRules: ComputedRef<GameRule[]> = computed(
  () => store.getters.getCurrentLevelRules
);
const currentFulfillLevelPart = computed(
  () => currentLevelRules.value[fulfillLevelCounter.value]
);
const isActivePlayer = computed(() => store.getters.amIActivePlayer);
const skipLevelFulfillStep = () => {
  fulfillLevelCounter.value = 0;
  fulfillLevelMode.value = false;
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
  fulfillLevelMode.value = true;
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
  fulfillLevelMode.value = false;
  store.commit("abortFulfillment");
};
const nextFulfillmentPart = () => {
  store.commit("nextFulfillmentPart", currentFulfillLevelPart.value.type);
  fulfillLevelCounter.value = fulfillLevelCounter.value + 1;
};
const finishFulfillment = () => {
  store.commit("nextFulfillmentPart", currentFulfillLevelPart.value.type);
  fulfillLevelCounter.value = 0;
  fulfillLevelMode.value = false;
  store.commit("finishFulfillment");
};
const isLastPart = computed(
  () => fulfillLevelCounter.value + 1 === currentLevelRules.value.length
);
</script>

<style scoped>
ul {
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}
.my-hand {
  padding: 2rem;
}
</style>
