<template>
  <a href="#" @click.prevent="logout">{{ i18n.logout }}</a>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

export default defineComponent({
  name: "Logout",
  setup() {
    const store = useStore(key);
    const logout = (e: Event) => {
      store.commit("logout");
    };
    const i18n = computed(() => store.getters.i18n);
    return {
      i18n,
      logout,
    };
  },
});
</script>
