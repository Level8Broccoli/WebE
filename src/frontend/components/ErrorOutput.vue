<template>
  <div>
    <h2>Error output</h2>
    <ul style="color: red">
      <li v-for="(error, i) in errorLog" :key="i">
        {{ error }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";

export default defineComponent({
  name: "ErrorOutput",
  setup() {
    const store = useStore(key);
    const errorLog = store.state.errorLog;
    return { errorLog };
  },
});
</script>
