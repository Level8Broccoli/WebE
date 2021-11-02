<template>
  <main class="my-hand">
    <ul role="list">
      <li v-for="cardId in myHands" :key="cardId">
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
      Level erfüllen
    </button>
    <button v-if="fulfillLevelMode" @click.prevent="abortFulfillment">
      Abbrechen
    </button>
    <button
      v-if="fulfillLevelMode && valid && !isLastPart"
      @click.prevent="nextFulfillmentPart"
    >
      NextStep
    </button>
    <button
      v-if="fulfillLevelMode && valid && isLastPart"
      @click.prevent="finishFulfillment"
    >
      Finish Fulfillment
    </button>
    <button v-if="fulfillLevelMode && !valid" class="is-disabled">
      noch nicht valide
    </button>
    <button v-if="isInLevelFulfillStep" @click.prevent="skipLevelFulfillStep">
      Überspringen
    </button>
  </main>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { CardRowType, GameRule } from "../../../shared/model/Game";
import { key } from "../../store/store";
import CardView from "./CardView.vue";

export default defineComponent({
  name: "MyHand",
  components: { CardView },
  setup() {
    const store = useStore(key);
    const myHands: ComputedRef<string[]> = computed(
      () => store.getters.getMyHands
    );
    const fulfillLevelMode = ref(false);
    const fulfillLevelCounter = ref(0);
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
    const isInLevelFulfillStep = computed(
      () => isActivePlayer.value && store.getters.getCurrentStep === 1
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
    return {
      myHands,
      isInLevelFulfillStep,
      skipLevelFulfillStep,
      startFulfillingLevel,
      fulfillLevelMode,
      currentLevelRules,
      valid,
      abortFulfillment,
      nextFulfillmentPart,
      isLastPart,
      finishFulfillment,
    };
  },
});
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
