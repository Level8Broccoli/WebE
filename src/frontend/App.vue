<template>
  <div :class="mode">
    <Toolbar>
      <Title v-if="mode !== 'simple'" />
    </Toolbar>
    <Title v-if="mode === 'simple'" />
    <RegisterPlayerName v-if="mode === 'simple'" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import RegisterPlayerName from "./components/RegisterPlayerName.vue";
import Title from "./components/Title.vue";
import Toolbar from "./components/Toolbar.vue";
import { key } from "./store/store";

export default defineComponent({
  name: "App",
  components: {
    Title,
    RegisterPlayerName,
    Toolbar,
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
