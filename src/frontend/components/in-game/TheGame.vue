<template>
  <main>{{ game }}</main>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

export default defineComponent({
  name: "TheGame",
  setup() {
    const store = useStore(key);
    const game = computed(() => store.getters.getActiveGame);
    return { game };
  },
});
</script>
