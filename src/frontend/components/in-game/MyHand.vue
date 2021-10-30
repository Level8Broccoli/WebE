<template>
  <main>
    {{ myHands }}
  </main>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "vuex";
import { Card } from "../../../shared/model/Game";
import { key } from "../../store/store";

export default defineComponent({
  name: "MyHand",
  setup() {
    const store = useStore(key);
    const myHands: ComputedRef<Card[]> = computed(
      () => store.getters.getMyHands
    );
    return { myHands };
  },
});
</script>
