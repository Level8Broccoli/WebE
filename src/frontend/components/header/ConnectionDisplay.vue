<template>
  <div v-if="isConnected"><i class="far fa-check-circle"></i></div>
  <div v-else><i class="far fa-ban"></i></div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

export default defineComponent({
  name: "ConnectionDisplay",
  setup() {
    const store = useStore(key);
    const isConnected = computed(() => store.state.connection);
    return {
      isConnected
    };
  },
});
</script>

<style scoped>
</style>
