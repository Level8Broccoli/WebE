<template>
  <main>
    {{ drawPileCount }}
  </main>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

export default defineComponent({
  name: "DrawPile",
  setup() {
    const store = useStore(key);
    const drawPileCount: ComputedRef<number> = computed(
      () => store.getters.getDrawPileCount
    );
    return { drawPileCount };
  },
});
</script>
