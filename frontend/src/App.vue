<template>
  <div>
    <button @click="registerPlayer">Register Player "Tony"</button>
    <button @click="createGame">Create Game</button>
    <button @click="deleteGame">Delete Game</button>
    <button @click="joinGame">Join Game</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  createGame,
  deleteGame,
  initApi,
  joinGame,
  registerPlayer,
} from "./api/Api";

export default defineComponent({
  name: "App",
  created() {
    initApi();
  },
  methods: {
    registerPlayer() {
      registerPlayer("Tony");
    },
    createGame() {
      createGame();
    },
    deleteGame() {
      deleteGame();
    },
    joinGame() {
      joinGame();
    },
  },
});
</script>
