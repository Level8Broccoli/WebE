<template>
  <main class="my-hand">
    <button
      class="secondary"
      @click.prevent="switchSorting"
      v-if="sorting === 'COLOR'"
    >
      <i class="fas fa-shapes"></i>
    </button>
    <button
      class="secondary"
      @click.prevent="switchSorting"
      v-if="sorting === 'NUMBER'"
    >
      <i class="fas fa-sort-numeric-down"></i>
    </button>
    <ul role="list">
      <li v-for="cardId in myHand" :key="cardId">
        <CardView
          :id="cardId"
          :isHand="true"
          :isInFulfillmentMode="props.fulfillLevelMode"
        />
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { computed, ComputedRef, ref } from "vue";
import { useStore } from "vuex";
import { Card } from "../../../shared/model/Game";
import { key } from "../../store/store";
import CardView from "./CardView.vue";

type Props = {
  fulfillLevelMode: boolean;
};
const props = defineProps<Props>();

const store = useStore(key);

enum Sorting {
  COLOR = "COLOR",
  NUMBER = "NUMBER",
}
const sorting = ref(Sorting.NUMBER);
const myHand: ComputedRef<string[]> = computed(() => {
  const myHand: string[] = store.getters.getMyHands;
  const cards: Card[] = myHand.map((id) => store.getters.getCardById(id));
  if (sorting.value === Sorting.COLOR) {
    return cards
      .sort((a, b) =>
        a.color === b.color ? a.value - b.value : a.color.localeCompare(b.color)
      )
      .map((c) => c.id);
  } else if (sorting.value === Sorting.NUMBER) {
    return cards.sort((a, b) => a.value - b.value).map((c) => c.id);
  }
  return myHand;
});
const switchSorting = () => {
  const newValue =
    sorting.value === Sorting.COLOR ? Sorting.NUMBER : Sorting.COLOR;
  sorting.value = newValue;
};
</script>

<style scoped>
ul {
  padding: 0 2rem;
  margin: 0;
  display: flex;
  justify-content: space-around;
}

.my-hand {
  padding: 1rem 2rem;
  display: grid;
  grid-template-columns: max-content 1fr;
  align-items: center;
  overflow-x: auto;
  background: rgb(219, 219, 219);
  background: linear-gradient(
    0deg,
    rgb(219, 219, 219, 1) 0%,
    rgb(219, 219, 219, 0.3) 50%,
    rgb(219, 219, 219, 0.3) 100%
  );
}

button {
  padding-inline: 0.7em;
  aspect-ratio: 1;
  font-size: 1.5em;
}

.secondary {
  border: 1px solid #5432d3;
  background-color: transparent;
  color: #5432d3;
}
</style>
