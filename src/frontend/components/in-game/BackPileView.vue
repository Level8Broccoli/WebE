
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

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";
import EmptyPileView from "./EmptyPileView.vue";

export default defineComponent({
  name: "BackPileView",
  components: {
    EmptyPileView,
  },
  props: {
    count: { type: Number, default: 0 },
    isDrawPile: { type: Boolean, default: false },
  },
  setup(props) {
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
    return { count, isDrawPile, canBeDrawn, drawCard };
  },
});
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
