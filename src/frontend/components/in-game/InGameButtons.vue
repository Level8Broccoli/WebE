<template>
  <footer class="buttons bottom">
    <button v-if="isCreator" @click.prevent="deleteGame" class="secondary">
      <i class="far fa-long-arrow-left icon-left"></i>
      {{ i18n.deleteGameButton }}
    </button>
    <button v-else @click.prevent="abort" class="secondary">
      <i class="far fa-long-arrow-left icon-left"></i>
      {{ i18n.abortButton }}
    </button>
    <button v-if="isCreator && gameIsValid" @click.prevent="startGame">
      {{ i18n.startGameButton }}
      <i class="far fa-long-arrow-right icon-right"></i>
    </button>
    <button v-if="isCreator && !gameIsValid" class="is-disabled" disabled>
      {{ i18n.gameNeedsAtLeastTwoPlayers }}
      <i class="far fa-long-arrow-right icon-right"></i>
    </button>
  </footer>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

export default defineComponent({
  name: "InGameButtons",
  setup() {
    const store = useStore(key);
    const i18n = computed(() => store.getters.i18n);
    const game = computed(() => store.getters.getActiveGame);
    const isCreator = computed(
      () => game.value.creatorId === store.state.player.id
    );
    const gameIsValid = computed(() => game.value.players.length > 1);

    const abort = (e: Event) => {
      store.commit("leaveGame");
    };

    const deleteGame = (e: Event) => {
      store.commit("deleteGame");
    };

    const startGame = (e: Event) => {
      store.commit("startGame");
    };

    return {
      i18n,
      isCreator,
      gameIsValid,
      abort,
      deleteGame,
      startGame,
    };
  },
});
</script>

<style scoped>
.secondary {
  border: 1px solid #5432d3;
  background-color: transparent;
}
.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-content: space-between;
  gap: 1rem;
}
.is-disabled {
  background-color: #363636;
  cursor: not-allowed;
}
</style>
