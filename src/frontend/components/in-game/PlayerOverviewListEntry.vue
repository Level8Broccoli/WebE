
<template>
  <div :class="'entry ' + (isActivePlayer ? 'is-active' : '')">
    {{ playerName }} // {{ handCount }} // {{ discardPileTop }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { useStore } from "vuex";
import { OtherPlayerAggregate } from "../../../shared/model/Game";
import { key } from "../../store/store";

export default defineComponent({
  name: "PlayerOverviewListEntry",
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
.is-active {
  border: 1px solid #5432d3;
}
</style>
