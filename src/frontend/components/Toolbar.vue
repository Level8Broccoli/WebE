<template>
  <header>
    <section class="left">
      <slot></slot>
    </section>
    <section class="right">
      <LanguageSwitcher />
      <ConnectionDisplay />
    </section>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ConnectionDisplay from "./ConnectionDisplay.vue";
import LanguageSwitcher from "./LanguageSwitcher.vue";

export default defineComponent({
  name: "Toolbar",
  components: {
    ConnectionDisplay,
    LanguageSwitcher,
  },
});
</script>

<style scoped>
header {
  position: absolute;
  top: 2rem;
  right: 2rem;
  left: 2rem;
  display: grid;
  grid-template-columns: 1fr max-content;
}

.right {
  display: grid;
  grid-template-columns: max-content max-content;
  gap: 1rem;
}
</style>
