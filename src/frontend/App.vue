<template>
  <div :class="layout">
    <Title />
    <RegisterPlayerName />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Title from "./components/Title.vue";
import RegisterPlayerName from "./components/RegisterPlayerName.vue";

export default defineComponent({
  name: "App",
  data() {
    return {
      layout: "simple",
    };
  },
  components: {
    Title,
    RegisterPlayerName,
  },
});
</script>

<style scoped>
.simple {
  display: grid;
  place-content: center;
  gap: 5rem;
  min-height: 100vh;
}
.simple header {
  font-size: 2em;
}
</style>
