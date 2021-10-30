<template>
  <section>Lobby View</section>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";

export default defineComponent({
  name: "GameLobbyView",
  setup() {
    const store = useStore(key);
    const i18n = computed(() => store.getters.i18n);
    return {};
  },
});
</script>
