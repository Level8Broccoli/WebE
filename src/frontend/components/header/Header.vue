<template>
  <header>
    <section>
      <slot></slot>
    </section>
    <section class="right">
      <PlayerName v-if="playerIsRegistered" />
      <Logout v-if="playerIsRegistered" />
      <LeaderboardSwitcher />
      <RulesSwitcher />
      <LanguageSwitcher />
      <ConnectionDisplay />
    </section>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "vuex";
import { key } from "../../store/store";
import ConnectionDisplay from "../header/ConnectionDisplay.vue";
import LanguageSwitcher from "../header/LanguageSwitcher.vue";
import Logout from "../header/Logout.vue";
import PlayerName from "../header/PlayerName.vue";
import RulesSwitcher from "../header/RulesSwitcher.vue";
import LeaderboardSwitcher from "../header/LeaderboardSwitcher.vue";

const store = useStore(key);
const playerIsRegistered = computed(() => store.state.player.secret.length > 0);
</script>

<style scoped>
header {
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: center;
  min-height: 5rem;
}

.right {
  display: grid;
  grid-template-columns: repeat(6, max-content);
  gap: 1rem;
  align-content: flex-start;
  align-items: center;
}

a {
  color: black;
}

a:hover,
a:target {
  color: white;
  text-decoration: none;
}
</style>
