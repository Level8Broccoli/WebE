<template>
  <main>
    {{ i18n.drawPile }}
    <BackPileView :count="drawPileCount" :isDrawPile="true" />
  </main>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";
import BackPileView from "./BackPileView.vue";

export default defineComponent({
  name: "DrawPile",
  components: { BackPileView },
  setup() {
    const store = useStore(key);
    const drawPileCount: ComputedRef<number> = computed(
      () => store.getters.getDrawPileCount
    );
    const i18n = computed(() => store.getters.i18n);
    return { drawPileCount, i18n };
  },
});
</script>
