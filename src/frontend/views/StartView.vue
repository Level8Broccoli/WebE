<template>
  <section>
    <Title />
    <RegisterPlayerName />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Title from "../components/Title.vue";
import RegisterPlayerName from "../components/RegisterPlayerName.vue";

export default defineComponent({
  name: "StartView",
  components: { Title, RegisterPlayerName },
});
</script>

<style scoped>
section {
  display: grid;
  place-content: center;
  gap: 5rem;
  min-height: 100vh;
}
</style>
