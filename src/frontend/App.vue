<template>
  <div :class="mode">
    <LanguageSwitcher />
    <Title />
    <RegisterPlayerName v-if="mode === 'simple'" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "./store/store";
import LanguageSwitcher from "./components/LanguageSwitcher.vue";
import Title from "./components/Title.vue";
import RegisterPlayerName from "./components/RegisterPlayerName.vue";

export default defineComponent({
  name: "App",
  components: {
    LanguageSwitcher,
    Title,
    RegisterPlayerName,
  },
  setup() {
    const store = useStore(key);
    const secret = computed(() => store.state.player.secret);
    const mode = computed(() =>
      secret.value.length === 0 ? "simple" : "none"
    );

    return {
      mode,
      secret,
    };
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
