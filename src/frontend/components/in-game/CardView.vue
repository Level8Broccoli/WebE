
<template>
  <div
    :class="
      'card card-shadow color-' +
      card.color +
      (isAlreadyInFulfillment ? ' already-selected' : '') +
      (isAlreadySelected ? ' currently-selected' : '') +
      (canBeDiscarded || canBeDrawn || isInFulfillmentMode
        ? ' interactive'
        : '')
    "
    v-on="
      canBeDiscarded
        ? { click: discardCard }
        : canBeDrawn
        ? { click: drawCard }
        : isInFulfillmentMode
        ? { click: chooseForFulfillment }
        : isAlreadySelected
        ? { click: deselectCard }
        : {}
    "
  >
    <header class="top">
      <strong>{{ card.value }}</strong>
    </header>
    <footer class="bottom">
      <i v-if="card.color === 'ORANGE'" class="fas fa-circle"></i>
      <i v-if="card.color === 'BLUE'" class="fas fa-square"></i>
      <i v-if="card.color === 'RED'" class="fas fa-triangle"></i>
      <i v-if="card.color === 'VIOLET'" class="fas fa-star"></i>
      <i v-if="card.color === 'YELLOW'" class="fas fa-atom-alt"></i>
      <i v-if="card.color === 'GREEN'" class="fas fa-hexagon"></i>
    </footer>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "vuex";
import { Card } from "../../../shared/model/Game";
import { key } from "../../store/store";

export default defineComponent({
  name: "CardView",
  props: {
    id: { type: String, required: true },
    isHand: { type: Boolean, default: false },
    isDiscard: { type: Boolean, default: false },
    isInFulfillmentMode: { type: Boolean, default: false },
    owner: { type: String, default: "" },
  },
  setup(props) {
    const store = useStore(key);
    const canBeDiscarded = computed(
      () =>
        props.isHand &&
        store.getters.amIActivePlayer &&
        store.getters.getCurrentStep === 3
    );
    const discardCard = () => {
      store.commit("discardCard", { cardId: props.id });
    };
    const canBeDrawn = computed(
      () =>
        props.isDiscard &&
        store.getters.amIActivePlayer &&
        store.getters.getCurrentStep === 0
    );
    const drawCard = () => {
      store.commit("drawCard", {
        pileId: props.owner,
      });
    };
    const isAlreadySelected = computed(() => {
      const temp = store.state.tempCardsForFulfillment;
      if (temp.find((s) => s === props.id) !== undefined) {
        return true;
      }
      return false;
    });
    const isAlreadyInFulfillment = computed(() => {
      const prepared = store.state.cardRowsForFulfillment;
      for (const row of prepared) {
        if (row.cardIds.find(id => id === props.id) !== undefined) {
          return true;
        }
      }
      return false;
    });
    const isInFulfillmentMode = computed(
      () =>
        props.isInFulfillmentMode &&
        !isAlreadyInFulfillment.value &&
        !isAlreadySelected.value
    );
    const chooseForFulfillment = () => {
      store.commit("storeForFulfillment", { cardId: props.id });
    };
    const deselectCard = () => {
      store.commit("deselectCard", { cardId: props.id });
    };
    const card: ComputedRef<Card> = computed(() =>
      store.getters.getCardById(props.id)
    );
    return {
      card,
      canBeDiscarded,
      discardCard,
      canBeDrawn,
      drawCard,
      isInFulfillmentMode,
      chooseForFulfillment,
      isAlreadyInFulfillment,
      isAlreadySelected,
      deselectCard,
    };
  },
});
</script>

<style scoped>
.card {
  border-radius: 0.375em;
  background-color: #000000;
  background: linear-gradient(54deg, #000000 0%, #3d1122 100%);
  padding: 0.5rem;
  text-align: center;
  width: 3em;
  height: 5em;
  display: grid;
  grid-template-rows: 1fr 1fr;
}

.top,
.bottom {
  display: grid;
  place-items: center;
}

.color-ORANGE {
  color: #ca4f4f;
  border: 5px solid currentColor;
}
.color-BLUE {
  color: #3235cc;
  border: 5px solid currentColor;
}
.color-RED {
  color: #95163c;
  border: 5px solid currentColor;
}
.color-VIOLET {
  color: #6f388f;
  border: 5px solid currentColor;
}
.color-YELLOW {
  color: #a1a314;
  border: 5px solid currentColor;
}
.color-GREEN {
  color: #30af0a;
  border: 5px solid currentColor;
}
</style>
