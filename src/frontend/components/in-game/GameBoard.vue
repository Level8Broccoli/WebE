<template>
  <div>
    <ul role="list">
      <li v-for="row in cardRows" :key="row.id">
        <GameBoardRow :row="row" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import { useStore } from "vuex";
import { CardRow } from "../../../shared/model/Game";
import { key } from "../../store/store";
import GameBoardRow from "./GameBoardRow.vue";

const store = useStore(key);
const cardRows: ComputedRef<CardRow[]> = computed(
  () => store.getters.getGameBoard
);
</script>

<style scoped>
div {
  margin: 2rem;
}

ul {
  margin: 0;
  padding: 0;
}

div > ul {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem 2rem;
}

@media (max-width: 100rem) {
  div > ul {
    display: unset;
  }
}

div > ul ul {
  margin-block: 1rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
