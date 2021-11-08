<template>
  <div
    :class="
      'card spot ' +
      (props.outOfRange ? 'out-of-range' : isValidPlay ? 'interactive' : '')
    "
    v-on="isValidPlay ? { click: playCard } : {}"
  ></div>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import { useStore } from "vuex";
import { Card, CardRowType } from "../../../shared/model/Game";
import { key } from "../../store/store";

const store = useStore(key);

type Props = {
  outOfRange?: boolean;
  cardRowType: CardRowType;
  spotForValue?: number;
  spotForColor?: string;
  cardRowId: string;
};
const props = withDefaults(defineProps<Props>(), {
  outOfRange: false,
  spotForValue: -1,
  spotForColor: "",
});

const cardSelected: ComputedRef<Card> = computed(() => {
  const id = store.state.tempCardIdForPlay;
  return store.getters.getCardById(id);
});

const isValidPlay = computed(() => {
  if (cardSelected.value.id === "CARD-NOT-FOUND") {
    return false;
  }
  if (
    props.cardRowType === CardRowType.STREET &&
    props.spotForValue === cardSelected.value.value
  ) {
    return true;
  }
  if (
    props.cardRowType === CardRowType.SAME_COLOR &&
    props.spotForColor === cardSelected.value.color
  ) {
    return true;
  }
  if (
    props.cardRowType === CardRowType.SAME_NUMBER &&
    props.spotForValue === cardSelected.value.value
  ) {
    return true;
  }
  return false;
});

const playCard = () => {
  store.commit("playCard", props.cardRowId);
};
</script>

<style scoped>
.card {
  border-radius: 0.375em;
  background: rgba(2, 0, 36, 0.2);
  text-align: center;
  width: 3em;
  height: 5em;
  display: grid;
  place-items: center;
}
.out-of-range {
  border: 1px solid rgba(2, 0, 36, 0.2);
  background-color: transparent;
}
</style>
