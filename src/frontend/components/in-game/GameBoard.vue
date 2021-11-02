<template>
  <div>
    <ul role="list">
      <li v-for="(row, i) in cardRows" :key="i">
        <ul role="list">
          <li v-for="cardId in row.cardIds" :key="cardId">
            <CardView :id="cardId" />
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import { useStore } from "vuex";
import { CardRow } from "../../../shared/model/Game";
import { key } from "../../store/store";
import CardView from "./CardView.vue";

const store = useStore(key);
const cardRows: ComputedRef<CardRow[]> = computed(
  () => store.getters.getGameBoard
);
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
}
div > ul ul {
  margin-block: 1rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
