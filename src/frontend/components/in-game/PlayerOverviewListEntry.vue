
<template>
  <div :class="'entry ' + (isActivePlayer ? 'is-active' : '')">
    <p>
      {{ playerName }}
      <span v-if="isActivePlayer">{{ currentStep }}</span>
      <span v-else>{{ i18n.stepWaiting }}</span>
    </p>
    <BackPileView :count="handCount" />
    <CardView
      v-if="discardPile[0] !== null && discardPile[0] !== undefined"
      :id="discardPile[0].id"
      :color="discardPile[0].color"
      :value="discardPile[0].value"
      :isDiscard="true"
      :owner="playerId"
    />
    <EmptyPileView v-else />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { useStore } from "vuex";
import { PlayerOverviewAggregate } from "../../../shared/model/Game";
import { key } from "../../store/store";
import BackPileView from "./BackPileView.vue";
import CardView from "./CardView.vue";
import EmptyPileView from "./EmptyPileView.vue";

export default defineComponent({
  name: "PlayerOverviewListEntry",
  components: { CardView, BackPileView, EmptyPileView },
  props: {
    player: {
      type: Object as PropType<PlayerOverviewAggregate>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore(key);
    const playerId = computed(() => props.player.playerId);
    const playerName = computed(
      () => store.getters.getPlayerName(playerId.value) || playerId.value
    );
    const isActivePlayer = computed(() => props.player.isActivePlayer);
    const handCount = computed(() => props.player.handCardCount);
    const i18n = computed(() => store.getters.i18n);

    const currentStep = computed(() =>
      store.getters.translateCurrentStep(props.player.currentStep)
    );
    const discardPile = computed(() => props.player.discardPile);

    return {
      playerId,
      playerName,
      isActivePlayer,
      handCount,
      currentStep,
      discardPile,
      i18n,
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
    / max-content max-content;
  gap: 0.5rem;
}

p {
  grid-area: name;
}

.is-active {
  border: 1px solid #5432d3;
}
</style>
