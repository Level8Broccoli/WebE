<template>
  <main>
    <MyHand />
    <OtherPlayers />
    <h2>Hände:</h2>
    <ul>
      <li v-for="(hand, i) in game.state.hands" :key="i">
        {{ hand[0] }} <br />
        {{ hand[1] }}
      </li>
    </ul>
    <h2>Piles:</h2>
    <ul>
      <li v-for="(pile, i) in game.state.piles" :key="i">
        {{ pile[0] }} <br />
        {{ pile[1] }}
      </li>
    </ul>
  </main>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "vuex";
import { PublicGame } from "../../../shared/model/Game";
import { key } from "../../store/store";
import MyHand from "./MyHand.vue";
import OtherPlayers from "./OtherPlayers.vue";

export default defineComponent({
  name: "TheGame",
  components: {
    MyHand,
    OtherPlayers,
  },
  setup() {
    const store = useStore(key);
    const game: ComputedRef<PublicGame> = computed(
      () => store.getters.getActiveGame
    );
    return { game };
  },
});
</script>
