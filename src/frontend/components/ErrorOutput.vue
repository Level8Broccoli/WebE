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

<script setup lang="ts">
import { useStore } from "vuex";
import { key } from "../store/store";

const store = useStore(key);
const errorLog = store.state.errorLog;
</script>
