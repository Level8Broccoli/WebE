
<template>
  <div :class="joinButton ? 'entry' : 'entry no-join-button'">
    <div>
      {{ i18n.creatorNameLabel }}: <span>{{ creatorName }}</span>
    </div>
    <div>
      {{ i18n.levelSystemLabel }}:
      <span>{{ game.config.levelSystem }}</span>
    </div>
    <div>
      {{ i18n.levelCountLabel }}:
      <span>{{ game.config.levelCount }}</span>
    </div>
    <div>
      {{ i18n.playerCountLabel }}:
      <span>{{ game.players.length }} / {{ game.config.maxPlayerCount }}</span>
    </div>
    <button v-if="joinButton" @click.prevent="joinGame">
      {{ i18n.joinGameButtonLabel }}
      <i class="far fa-long-arrow-right icon-right"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { useStore } from "vuex";
import { PublicGame } from "../../../shared/model/Game";
import { key } from "../../store/store";

export default defineComponent({
  name: "GameListEntry",
  props: {
    game: { type: Object as PropType<PublicGame>, required: true },
    joinButton: { type: Boolean, default: true },
  },
  setup(props) {
    const store = useStore(key);
    const i18n = computed(() => store.getters.i18n);
    const creatorName = computed(
      () =>
        store.getters.getPlayerName(props.game.creatorId) ||
        props.game.creatorId
    );
    const joinGame = (e: Event) => {
      store.commit("joinGame", props.game.id);
    };
    return {
      i18n,
      creatorName,
      joinGame,
      ...props,
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

.no-join-button {
  background-color: #ffffff;
  grid-template-columns: 2fr repeat(3, 1fr);
}
</style>
