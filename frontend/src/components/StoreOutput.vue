<template>
  <div>
    <h2>Client state</h2>
    <pre>{{ state }}</pre>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";

export default defineComponent({
  name: "StoreOutput",
  setup() {
    const store = useStore(key);
    const state = store.state;
    return {
      state,
    };
  },
});
</script>
