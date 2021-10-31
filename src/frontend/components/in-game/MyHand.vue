<template>
  <main class="my-hand">
    <ul role="list">
      <li v-for="(card) in myHands" :key="card.id">
        <CardView :card="card" :isHand="true" />
      </li>
    </ul>
  </main>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "vuex";
import { Card } from "../../../shared/model/Game";
import { key } from "../../store/store";
import CardView from "./CardView.vue";

export default defineComponent({
  name: "MyHand",
  components: { CardView },
  setup() {
    const store = useStore(key);
    const myHands: ComputedRef<Card[]> = computed(
      () => store.getters.getMyHands
    );
    return { myHands };
  },
});
</script>

<style scoped>
ul {
  padding: 0;
  margin: 0;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}
.my-hand {
  padding: 2rem;
}
</style>
