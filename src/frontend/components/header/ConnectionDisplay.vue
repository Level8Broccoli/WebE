<template>
  <div v-if="isConnected">
    <i class="far fa-check-circle"></i>
  </div>
  <div v-else>
    <i class="far fa-ban"></i>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

const store = useStore(key);
const isConnected = computed(() => store.state.connection);
</script>

<style scoped>
</style>
