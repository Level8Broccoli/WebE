
<template>
  <div :class="'card color-' + card.color">
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
import { defineComponent, PropType } from "vue";
import { Card } from "../../../shared/model/Game";

export default defineComponent({
  name: "CardView",
  props: {
    card: { type: Object as PropType<Card>, required: true },
  },
  setup(props) {
    return {
      ...props,
    };
  },
});
</script>

<style scoped>
.card {
  border-radius: 0.375em;
  background-color: #000000;
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
