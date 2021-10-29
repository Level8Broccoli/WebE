<template>
  <section>
    <button @click.prevent="createNewGame">
      {{ createNewGameButtonLabel }}
    </button>
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";

export default defineComponent({
  name: "GameSearchView",
  setup() {
    const store = useStore(key);
    const createNewGame = (e: Event) => {
      store.commit("registerPlayer");
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
