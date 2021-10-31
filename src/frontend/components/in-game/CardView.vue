
<template>
  <div :class="'card color-' + color" v-if="isCard">
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
import { Card } from "../../../shared/model/Game";
import EmptyPileView from "./EmptyPileView.vue";
export default defineComponent({
  name: "CardView",
  components: { EmptyPileView },
  props: {
    card: { type: Object as PropType<Card> },
  },
  setup(props) {
    const card = computed(() => props.card);
    if (typeof card === "undefined" || typeof card!.value === "undefined") {
      return { isCard: false, value: 0, color: "NONE" };
    }
    const color = computed(() => {
      if (typeof card !== "undefined" && "color" in card!.value!) {
        return card!.value!.color;
      }
      return "NONE";
    });
    return { isCard: true, value: card!.value!.value!, color };
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
