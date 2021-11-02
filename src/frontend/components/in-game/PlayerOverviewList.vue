<template>
  <main class="player-overview">
    <ul role="list">
      <li
        v-for="player in otherPlayers"
        :key="player.playerId"
        :class="player.isActivePlayer ? 'is-active' : ''"
      >
        <PlayerOverviewListEntry :player="player" />
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import { useStore } from "vuex";
import { PlayerOverviewAggregate } from "../../../shared/model/Game";
import { key } from "../../store/store";
import PlayerOverviewListEntry from "./PlayerOverviewListEntry.vue";

const store = useStore(key);
const otherPlayers: ComputedRef<PlayerOverviewAggregate[]> = computed(
  () => store.getters.aggregateOtherPlayers
);
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
}
</style>
