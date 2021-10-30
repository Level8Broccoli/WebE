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

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";
import PlayerListEntry from "./PlayerListEntry.vue";

export default defineComponent({
  name: "PlayerList",
  components: { PlayerListEntry },
  setup() {
    const store = useStore(key);
    const game = computed(() => store.state.activeGame);
    const playerCount = computed(() => game.value.config.maxPlayerCount);
    const playerList = computed(() => game.value.players);
    const creatorId = computed(() => game.value.creatorId);

    const emptySlots = computed(
      () => playerCount.value - playerList.value.length
    );
    return {
      playerList,
      emptySlots,
      creatorId,
    };
  },
});
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
