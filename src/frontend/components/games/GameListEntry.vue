
<template>
  <div class="entry">
    <div>
      {{ creatorNameLabel }}: <span>{{ creatorName }}</span>
    </div>
    <div>
      {{ levelSystemLabel }}: <span>{{ game.config.levelSystem }}</span>
    </div>
    <div>
      {{ levelCountLabel }}: <span>{{ game.config.levelCount }}</span>
    </div>
    <div>
      {{ playerCountLabel }}:
      <span>{{ game.players.length }} / {{ game.config.maxPlayerCount }}</span>
    </div>
    <button>
      {{ joinGameButtonLabel }}
      <i class="far fa-long-arrow-right icon-right"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { useStore } from "vuex";
import { Game } from "../../../shared/model/Game";
import { key } from "../../store/store";

export default defineComponent({
  name: "GameListEntry",
  props: {
    game: Object as PropType<Game>,
  },
  setup(props) {
    const store = useStore(key);
    const i18n = computed(() => store.getters.i18n);
    const playerCountLabel = computed(() => i18n.value.playerCountLabel);
    const levelCountLabel = computed(() => i18n.value.levelCountLabel);
    const levelSystemLabel = computed(() => i18n.value.levelSystemLabel);
    const joinGameButtonLabel = computed(() => i18n.value.joinGameButtonLabel);
    const creatorNameLabel = computed(() => i18n.value.creatorNameLabel);
    const creatorName = computed(
      () =>
        store.getters.getPlayerName(props.game.creatorId) ||
        props.game.creatorId
    );
    return {
      playerCountLabel,
      levelCountLabel,
      levelSystemLabel,
      joinGameButtonLabel,
      creatorNameLabel,
      creatorName,
    };
  },
});
</script>

<style scoped>
.entry {
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  border-radius: 0.375em;
  background-color: #dbdbdb;
  padding: 1rem;
  color: #363636;
  align-items: center;
}
.entry:hover {
  background-color: #ffffff;
}
span {
  font-weight: 900;
  display: block;
}
</style>
