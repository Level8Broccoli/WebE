
<template>
  <div class="card back" v-if="count > 0">
    {{ count }}
  </div>
  <EmptyPileView v-else />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EmptyPileView from "./EmptyPileView.vue";

export default defineComponent({
  name: "BackPileView",
  components: {
    EmptyPileView,
  },
  props: {
    count: { type: Number, default: 0 },
  },
  setup(props) {
    return { ...props };
  },
});
</script>

<style scoped>
.card {
  border-radius: 0.375em;
  background: rgb(2, 0, 36);
  background: linear-gradient(54deg, #01024e 0%, #ff6464 100%);
  text-align: center;
  width: 3em;
  height: 5em;
  display: grid;
  place-items: center;
}
</style>
