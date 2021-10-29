<template>
  <section>
    <CreateGame />
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import CreateGame from "../components/games/CreateGame.vue";

export default defineComponent({
  name: "GameCreateView",
  components: { CreateGame },
});
</script>
