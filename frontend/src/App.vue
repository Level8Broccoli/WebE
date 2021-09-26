<template>
  <div>
    <h1>Level 8 Game</h1>
    <label for="playerName">
      Your Name
      <input type="text" v-model="playerName" name="playerName" />
    </label>
    <button @click="registerPlayer">Register</button>
    <hr />
    <label for="maxPlayerCountForGame">
      Max Player Count
      <input
        type="number"
        min="1"
        max="4"
        v-model="maxPlayerCountForGame"
        name="maxPlayerCountForGame"
      />
    </label>
    <button @click="createGame">Create Game</button>
    <hr />
    <button @click="deleteGame">Delete Game</button>
    <button @click="joinGame">Join Game</button>
    <button @click="leaveGame">Leave Game</button>
    <hr />
    <small>by Thierry and Oliver</small>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  createGame,
  deleteGame,
  initApi,
  joinGame,
  leaveGame,
  registerPlayer,
} from "./api/Api";

export default defineComponent({
  name: "App",
  data() {
    return {
      playerName: "",
      maxPlayerCountForGame: 0,
    };
  },
  created() {
    initApi();
  },
  methods: {
    registerPlayer() {
      registerPlayer(this.playerName);
    },
    createGame() {
      createGame(this.maxPlayerCountForGame);
    },
    deleteGame() {
      deleteGame();
    },
    joinGame() {
      joinGame();
    },
    leaveGame() {
      leaveGame();
    },
  },
});
</script>
