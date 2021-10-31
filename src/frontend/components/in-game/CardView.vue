
<template>
  <div
    :class="
      'card card-shadow color-' +
      color +
      (canBeDiscarded || canBeDrawn ? ' interactive' : '')
    "
    v-if="isCard"
    v-on="
      canBeDiscarded
        ? { click: discardCard }
        : canBeDrawn
        ? { click: drawCard }
        : {}
    "
  >
    <header class="top">
      <strong>{{ value }}</strong>
    </header>
    <footer class="bottom">
      <i v-if="color === 'ORANGE'" class="fas fa-circle"></i>
      <i v-if="color === 'BLUE'" class="fas fa-square"></i>
      <i v-if="color === 'RED'" class="fas fa-triangle"></i>
      <i v-if="color === 'VIOLET'" class="fas fa-star"></i>
      <i v-if="color === 'YELLOW'" class="fas fa-atom-alt"></i>
      <i v-if="color === 'GREEN'" class="fas fa-hexagon"></i>
    </footer>
  </div>
  <EmptyPileView v-else />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { useStore } from "vuex";
import { Card } from "../../../shared/model/Game";
import { key } from "../../store/store";
import EmptyPileView from "./EmptyPileView.vue";
export default defineComponent({
  name: "CardView",
  components: { EmptyPileView },
  props: {
    card: { type: Object as PropType<Card> },
    isHand: { type: Boolean, default: false },
    isDiscard: { type: Boolean, default: false },
    owner: { type: String, default: "" },
  },
  setup(props) {
    const store = useStore(key);
    const card = computed(() => props.card);
    if (typeof card === "undefined" || typeof card!.value === "undefined") {
      return {
        isCard: false,
        value: 0,
        color: "NONE",
        canBeDiscarded: false,
        discardCard: () => {},
        canBeDrawn: false,
        drawCard: () => {},
      };
    }
    const color = computed(() => {
      if (typeof card !== "undefined" && "color" in card!.value!) {
        return card!.value!.color;
      }
      return "NONE";
    });

    const canBeDiscarded = computed(
      () =>
        props.isHand &&
        store.getters.amIActivePlayer &&
        store.getters.getCurrentStep === 3
    );

    const discardCard = (e: Event) => {
      store.commit("discardCard", { cardId: card!.value!.id! });
    };

    const canBeDrawn = computed(
      () =>
        props.isDiscard &&
        store.getters.amIActivePlayer &&
        store.getters.getCurrentStep === 0
    );
    const drawCard = (e: Event) => {
      store.commit("drawCard", { pileId: props.owner });
    };

    return {
      isCard: true,
      value: card!.value!.value!,
      color,
      canBeDiscarded,
      discardCard,
      canBeDrawn,
      drawCard,
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
