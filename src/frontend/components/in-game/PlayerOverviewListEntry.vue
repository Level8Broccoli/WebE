
<template>
  <div :class="'entry ' + (isActivePlayer ? 'is-active' : '')">
    <p>{{ playerName }}</p>
    <BackPileView :count="handCount" />
    <CardView :card="discardPileTop" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { useStore } from "vuex";
import { OtherPlayerAggregate } from "../../../shared/model/Game";
import { key } from "../../store/store";
import BackPileView from "./BackPileView.vue";
import CardView from "./CardView.vue";

export default defineComponent({
  name: "PlayerOverviewListEntry",
  components: { CardView, BackPileView },
  props: {
    player: {
      type: Object as PropType<OtherPlayerAggregate>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore(key);
    const playerName = computed(
      () =>
        store.getters.getPlayerName(props.player.playerId) ||
        props.player.playerId
    );
    const isActivePlayer = computed(() => props.player.isActivePlayer);
    const handCount = computed(() => props.player.handCardCount);
    const discardPileTop = computed(() => props.player.discardPile[0]);

    return {
      playerName,
      isActivePlayer,
      handCount,
      discardPileTop,
    };
  },
});
</script>

<style scoped>
.entry {
  display: grid;
  grid-template:
    "name name" max-content
    "hand discard" max-content
    / 1fr 1fr;
}

p {
  grid-area: name;
}

.is-active {
  border: 1px solid #5432d3;
}
</style>
