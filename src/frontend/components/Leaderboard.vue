<template>
  <section>
    <button @click="closeLeaderboard">
      <i class="far fa-times icon-left"></i> {{ i18n.closeLeaderboard }}
    </button>
    <h1>{{ i18n.leaderboardTitle }}</h1>
    <table>
      <thead>
        <tr>
          <th>{{ i18n.place }}</th>
          <th>{{ i18n.playerName }}</th>
          <th>{{ i18n.wins }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in leaderboard" :key="entry.name">
          <td>{{ index + 1 }}</td>
          <td>{{ entry.name }}</td>
          <td>{{ entry.wins }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { Language } from "../i18n/i18n";
import { key } from "../store/store";

const store = useStore(key);
const language = computed(() => store.state.language);
const isEnglish = computed(() => language.value == Language.ENGLISH);
const i18n = computed(() => store.getters.i18n);
const closeLeaderboard = () => {
  store.commit("switchLeaderboard");
};
store.commit("getLeaderboard");
const leaderboard = computed(() => store.getters.getLeaderboard);
</script>

<style scoped>
button {
  margin-bottom: 1rem;
}
</style>
