<template>
  <header>
    <h1>Level <span>8</span> Game</h1>
    <small>{{authors}}</small>
  </header>
</template>

<script>
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";

export default defineComponent({
  name: "Title",
  setup() {
    const store = useStore(key);
    const authors = computed(()=> store.getters.i18n.authors);
    return { authors };
  },
});
</script>


<style scoped>
header {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  align-items: center;
  text-align: center;
}
small {
  font-weight: 300;
  color: #ff6464;
  text-align: center;
}
@media (min-width: 800px) {
  header {
    grid-template-columns: max-content 1fr;
    gap: 2.5rem;
  }

  small {
    text-align: left;
  }
}
</style>
