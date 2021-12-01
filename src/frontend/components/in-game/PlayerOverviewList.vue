<template>
  <main class="player-overview">
    <ul
      role="list"
      :class="otherPlayers.length === 3 ? 'two-col' : 'three-col'"
    >
      <li
        v-for="player in otherPlayers"
        :key="player.playerId"
        :class="player.isActivePlayer ? 'is-active' : ''"
      >
        <PlayerOverviewListEntry :player="player" />
      </li>
      <DrawPile />
    </ul>
  </main>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import { useStore } from "vuex";
import { PlayerOverviewAggregate } from "../../../shared/model/Game";
import { key } from "../../store/store";
import DrawPile from "./DrawPile.vue";
import PlayerOverviewListEntry from "./PlayerOverviewListEntry.vue";

const store = useStore(key);
const otherPlayers: ComputedRef<PlayerOverviewAggregate[]> = computed(
  () => store.getters.aggregateOtherPlayers
);
</script>

<style scoped>
main {
  padding: 0.5rem;
  background: rgb(219, 219, 219);
  background: linear-gradient(
    180deg,
    rgb(219, 219, 219, 1) 0%,
    rgb(219, 219, 219, 0.3) 50%,
    rgb(219, 219, 219, 0.3) 100%
  );
}

ul {
  margin: 0;
  padding: 0;
  display: grid;
}
.two-col {
  grid-template-columns: repeat(2, 1fr);
}

.three-col {
  grid-template-columns: repeat(3, 1fr);
}
</style>
