<template>
  <aside>
    <ul>
      <li>maxPlayerCount: {{ gameConfig.maxPlayerCount }}</li>
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
    const gameConfig = computed(() => store.getters.getGameConfig);

    return {
      gameConfig,
    };
  },
});
</script>
