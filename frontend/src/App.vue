<template>
  <div>
    <h1>Level 8 Game</h1>
    <PlayerName />
    <hr />
    <CreateGame />
    <hr />
    <GameOverview />
    <hr />
    <Chat />
    <hr />
    <StoreOutput />
    <hr />
    <ErrorOutput />
    <hr />
    <small>by Thierry and Oliver</small>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import PlayerName from "./components/PlayerName.vue";
import CreateGame from "./components/CreateGame.vue";
import GameOverview from "./components/GameOverview.vue";
import Chat from "./components/Chat.vue";
import StoreOutput from "./components/StoreOutput.vue";
import ErrorOutput from "./components/ErrorOutput.vue";

export default defineComponent({
  name: "App",
  components: {
    PlayerName,
    CreateGame,
    GameOverview,
    Chat,
    StoreOutput,
    ErrorOutput,
  },
});
</script>
