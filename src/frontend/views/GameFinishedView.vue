<template>
  <section>
    <h2>{{ i18n.gameFinished }}</h2>
    <ul>
      <li v-for="player in playerList" :key="player.id">
        <strong v-if="player.winner">
          {{ toAuthorName(player.id) }} <i class="far fa-stars"></i>
        </strong>
        <em v-else>
          {{ toAuthorName(player.id) }}
        </em>
      </li>
    </ul>
    <button @click="removeActiveGame" class="secondary">
      {{ i18n.backToGameList }}
      <i class="far fa-long-arrow-right icon-right"></i>
    </button>
    <button @click="openLeaderboard">
      {{ i18n.openLeaderboard }}
      <i class="far fa-long-arrow-right icon-right"></i>
    </button>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../store/store";

const store = useStore(key);
const i18n = computed(() => store.getters.i18n);
const openLeaderboard = () => {
  store.commit("switchLeaderboard");
};
const removeActiveGame = () => {
  store.commit("removeActiveGame");
};
const toAuthorName = (playerId: string) => {
  return computed(
    () => store.getters.getPlayerName(playerId) || i18n.value.playerUnknown
  );
};

const playerList = computed(() => store.getters.getPlayerListWithWinner);
</script>

<style scoped>
.secondary {
  border: 1px solid #5432d3;
  background-color: transparent;
}

button {
  margin-right: 1rem;
}
</style>
