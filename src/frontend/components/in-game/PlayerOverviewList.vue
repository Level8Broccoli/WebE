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

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "vuex";
import { PlayerOverviewAggregate } from "../../../shared/model/Game";
import { key } from "../../store/store";
import PlayerOverviewListEntry from "./PlayerOverviewListEntry.vue";

export default defineComponent({
  name: "PlayerOverviewList",
  components: { PlayerOverviewListEntry },
  setup() {
    const store = useStore(key);
    const otherPlayers: ComputedRef<PlayerOverviewAggregate[]> = computed(
      () => store.getters.aggregateOtherPlayers
    );
    return { otherPlayers };
  },
});
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
}
</style>
