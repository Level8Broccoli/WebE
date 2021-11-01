<template>
  <footer class="buttons bottom">
    <button v-if="isCreator" @click.prevent="deleteGame" class="secondary">
      <i class="far fa-long-arrow-left icon-left"></i>
      {{ i18n.deleteGameButton }}
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
    const deleteGame = () => {
      store.commit("deleteGame");
    };
    return {
      i18n,
      isCreator,
      deleteGame,
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
</style>
