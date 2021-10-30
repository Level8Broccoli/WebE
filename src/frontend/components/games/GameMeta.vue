<template>
  <aside>
    <ul role="list">
      <li>
        {{ i18n.creatorNameLabel }}:
        <span>{{ creatorName }}</span>
      </li>
      <li>
        {{ i18n.levelSystemLabel }}:
        <span>{{ gameConfig.levelSystem }}</span>
      </li>
      <li>
        {{ i18n.levelCountLabel }}:
        <span>{{ gameConfig.levelCount }}</span>
      </li>
      <li>
        {{ i18n.playerCountLabel }}:
        <span>{{ playerCount }} / {{ gameConfig.maxPlayerCount }}</span>
      </li>
    </ul>
  </aside>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

export default defineComponent({
  name: "GameMeta",
  setup() {
    const store = useStore(key);
    const i18n = computed(() => store.getters.i18n);
    const game = computed(() => store.state.activeGame);
    const playerCount = computed(() => game.value.players.length);
    const gameConfig = computed(() => game.value.config);
    const creatorName = computed(
      () =>
        store.getters.getPlayerName(game.value.creatorId) ||
        game.value.creatorId
    );
    return {
      gameConfig,
      i18n,
      playerCount,
      creatorName,
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
