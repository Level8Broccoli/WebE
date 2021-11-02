<template>
    <div :class="'card spot ' + (props.outOfRange ? 'out-of-range' : '')"></div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";

type Props = {
    outOfRange?: boolean
}
const props = withDefaults(defineProps<Props>(), {
    outOfRange: false
})


</script>

<style scoped>
.card {
    border-radius: 0.375em;
    background: rgba(2, 0, 36, 0.2);
    text-align: center;
    width: 3em;
    height: 5em;
    display: grid;
    place-items: center;
}
.out-of-range {
    border: 1px solid rgba(2, 0, 36, 0.2);
    background-color: transparent;
}
</style>
