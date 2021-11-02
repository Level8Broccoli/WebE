<template>
  <aside>
    <ul role="list">
      <li v-for="playerId in playerList" :key="playerId">
        <PlayerListEntry :playerId="playerId" :creatorId="creatorId" />
      </li>
      <li v-for="index in emptySlots" :key="index">
        <PlayerListEntry :isEmpty="true" />
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";
import PlayerListEntry from "./PlayerListEntry.vue";

const store = useStore(key);
const game = computed(() => store.getters.getActiveGame);
const playerCount = computed(() => game.value.config.maxPlayerCount);
const playerList = computed(() => game.value.players);
const creatorId = computed(() => game.value.creatorId);

const emptySlots = computed(
  () => playerCount.value - playerList.value.length
);
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
}
li + li {
  margin-top: 1rem;
}
</style>
