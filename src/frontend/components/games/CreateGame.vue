<template>
  <form>
    <label for="maxPlayerCount">{{ maxPlayerCountLabel }}:</label>
    <input
      type="number"
      :value="maxPlayerCount"
      @input="updateMaxPlayerCount"
      name="maxPlayerCount"
      id="maxPlayerCount"
    />
    <label for="levelCount">{{ levelCountLabel }}:</label>
    <input
      type="number"
      :value="levelCount"
      @input="updateLevelCount"
      name="levelCount"
      id="levelCount"
    />
    <label for="levelSystemNormal">{{ levelSystemNormalLabel }}:</label>
    <input
      type="radio"
      :value="levelSystem"
      @input="updateLevelSystem"
      name="levelSystemNormal"
      id="levelSystemNormal"
    />
    <label for="levelSystemRandom">{{ levelSystemRandomLabel }}:</label>
    <input
      type="radio"
      :value="levelSystem"
      @input="updateLevelSystem"
      name="levelSystemRandom"
      id="levelSystemRandom"
    />
    <div class="buttons">
      <button @click.prevent="abort" class="secondary">
        {{ abortButton }}
      </button>
      <button @click.prevent="createGame">{{ createGameButton }}</button>
    </div>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { LevelSystem } from "../../../shared/model/Game";
import { key } from "../../store/store";

export default defineComponent({
  name: "CreateGame",
  setup() {
    const store = useStore(key);
    const i18n = computed(() => store.getters.i18n);

    const maxPlayerCount = ref(6);
    const levelCount = ref(8);
    const levelSystem = ref(LevelSystem.NORMAL);

    const createGame = false;
    const createGameButton = computed(
      () => i18n.value.createNewGameButtonLabel
    );
    const abort = false;
    const abortButton = computed(() => i18n.value.abortButton);

    return {
      maxPlayerCount,
      levelCount,
      levelSystem,
      createGame,
      createGameButton,
      abort,
      abortButton,
    };
  },
});
</script>

<style scoped>
.secondary {
  border: 1px solid #5432d3;
  background-color: transparent;
}
.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-content: space-between;
  gap: 1rem;
}
</style>
