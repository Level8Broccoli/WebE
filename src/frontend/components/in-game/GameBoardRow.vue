<template>
    <ul role="list">
        <li>
            <CardSpot :out-of-range="row.type === 'STREET' && firstCard.value === 1" />
        </li>
        <li v-for="cardId in row.cardIds" :key="cardId">
            <CardView :id="cardId" />
        </li>
        <li>
            <CardSpot :out-of-range="row.type === 'STREET' && lastCard.value === 1" />
        </li>
    </ul>
</template>

<script setup lang="ts">
import { computed, ComputedRef } from "vue";
import { useStore } from "vuex";
import { Card, CardRow } from "../../../shared/model/Game";
import { key } from "../../store/store";
import CardSpot from "./CardSpot.vue";
import CardView from "./CardView.vue";

const store = useStore(key);

type Props = {
    row: CardRow
}
const props = defineProps<Props>();

const row = props.row;
const firstCard: ComputedRef<Card> = computed(() =>
    store.getters.getCardById(row.cardIds[0])
);
const lastCard: ComputedRef<Card> = computed(() =>
    store.getters.getCardById(row.cardIds[row.cardIds.length - 1])
);

</script>
