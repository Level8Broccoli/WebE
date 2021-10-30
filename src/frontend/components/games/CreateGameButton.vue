<template>
  <button @click.prevent="createNewGame" class="createNewGame">
    {{ createNewGameButtonLabel }}
    <i class="far fa-long-arrow-right"></i>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

export default defineComponent({
  name: "CreateGameButton",
  setup() {
    const store = useStore(key);
    const createNewGame = (e: Event) => {
      store.commit("initNewGame");
    };
    const i18n = computed(() => store.getters.i18n);
    const createNewGameButtonLabel = computed(
      () => i18n.value.createNewGameButtonLabel
    );
    return {
      createNewGame,
      createNewGameButtonLabel,
    };
  },
});
</script>

<style scoped>
.createNewGame {
  width: 100%;
}
</style>
