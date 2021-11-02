
<template>
  <div class="empty">
    <span>{{ i18n.emptyCardSlot }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

const store = useStore(key);
const i18n = computed(() => store.getters.i18n);
</script>

<style scoped>
.empty {
  border-radius: 0.375em;
  border: 5px dotted #000000;
  color: #000000;
  text-align: center;
  width: 3em;
  height: 5em;
  display: grid;
  place-items: center;
  font-style: italic;
  font-weight: 300;
  text-transform: uppercase;
}

.empty span {
  transform: rotate(-90deg);
}
</style>
