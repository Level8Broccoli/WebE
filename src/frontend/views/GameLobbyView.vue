<template>
  <section>
    <div class="left">
      <GameMeta />
    </div>
    <div class="right"></div>
    Player - Chat - Buttons
  </section>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";
import GameMeta from "../components/games/GameMeta.vue";

export default defineComponent({
  name: "GameLobbyView",
  components: {
    GameMeta,
  },
  setup() {
    const store = useStore(key);
    const i18n = computed(() => store.getters.i18n);
    return {};
  },
});
</script>
<style scoped>
section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
</style>
