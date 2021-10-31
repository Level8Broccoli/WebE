<template>
  <main>
    {{ otherPlayers }}
  </main>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "vuex";
import { OtherPlayerAggregate } from "../../../shared/model/Game";
import { key } from "../../store/store";

export default defineComponent({
  name: "OtherPlayers",
  setup() {
    const store = useStore(key);
    const otherPlayers: ComputedRef<OtherPlayerAggregate[]> = computed(
      () => store.getters.aggregateOtherPlayers
    );
    return { otherPlayers };
  },
});
</script>
