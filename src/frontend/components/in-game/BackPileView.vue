<template>
  <div
    :class="'card card-shadow back' + (canBeDrawn ? ' interactive' : '')"
    v-if="count > 0"
    v-on="canBeDrawn ? { click: drawCard } : {}"
  >
    {{ count }}
  </div>
  <EmptyPileView v-else />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";
import EmptyPileView from "./EmptyPileView.vue";

type Props = {
  count?: number;
  isDrawPile?: boolean;
};
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  isDrawPile: false,
});
const store = useStore(key);

const count = computed(() => props.count);
const isDrawPile = computed(() => props.isDrawPile);

const canBeDrawn = computed(
  () =>
    props.isDrawPile &&
    store.getters.amIActivePlayer &&
    store.getters.getCurrentStep === 0
);
const drawCard = () => {
  store.commit("drawCard", { pileId: "drawPile" });
};
</script>

<style scoped>
.card {
  border-radius: 0.375em;
  background: rgb(2, 0, 36);
  background: linear-gradient(54deg, #01024e 0%, #ff6464 100%);
  text-align: center;
  width: 3em;
  height: 5em;
  display: grid;
  place-items: center;
}
</style>
