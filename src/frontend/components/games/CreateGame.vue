<template>
  <form>
    <div>
      <div class="form-entry">
        <label for="maxPlayerCount">{{ maxPlayerCountLabel }}:</label>
        <input
          type="number"
          :value="maxPlayerCount"
          @input="updateMaxPlayerCount"
          min="1"
          max="6"
          name="maxPlayerCount"
          id="maxPlayerCount"
        />
      </div>
      <div class="form-entry">
        <label for="levelCount">{{ levelCountLabel }}:</label>
        <input
          type="number"
          :value="levelCount"
          @input="updateLevelCount"
          min="2"
          max="8"
          name="levelCount"
          id="levelCount"
        />
      </div>
      <div class="form-entry">
        <button
          @click.prevent="changeToLevelSystemNormal"
          :class="levelSystem === 'NORMAL' ? 'active' : 'not-active'"
        >
          {{ levelSystemNormalLabel }}
        </button>
        <button
          @click.prevent="changeToLevelSystemRandom"
          :class="levelSystem === 'RANDOM' ? 'active' : 'not-active'"
        >
          {{ levelSystemRandomLabel }}
        </button>
      </div>
    </div>
    <div class="buttons bottom">
      <button @click.prevent="abort" class="secondary">
        <i class="far fa-long-arrow-left icon-left"></i>
        {{ abortButton }}
      </button>
      <button @click.prevent="finalizeGameCreation">
        {{ createGameButton }}
        <i class="far fa-long-arrow-right icon-right"></i>
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "vuex";
import { Config, LevelSystem } from "../../../shared/model/Game";
import { key } from "../../store/store";

export default defineComponent({
  name: "CreateGame",
  setup() {
    const store = useStore(key);
    const i18n = computed(() => store.getters.i18n);

    const currentConfig: ComputedRef<Config> = computed(
      () => store.state.gameInCreation
    );
    const maxPlayerCount = computed(() => currentConfig.value.maxPlayerCount);
    const levelCount = computed(() => currentConfig.value.levelCount);
    const levelSystem = computed(() => currentConfig.value.levelSystem);

    const finalizeGameCreation = (e: Event) => {
      store.commit("finalizeGameCreation");
    };
    const createGameButton = computed(
      () => i18n.value.createNewGameButtonLabel
    );
    const abort = (e: Event) => {
      store.commit("abortGameInCreation");
    };
    const abortButton = computed(() => i18n.value.abortButton);

    const maxPlayerCountLabel = computed(() => i18n.value.maxPlayerCountLabel);
    const levelCountLabel = computed(() => i18n.value.levelCountLabel);
    const levelSystemNormalLabel = computed(
      () => i18n.value.levelSystemNormalLabel
    );
    const levelSystemRandomLabel = computed(
      () => i18n.value.levelSystemRandomLabel
    );

    const changeToLevelSystemNormal = (e: Event) => {
      store.commit("updateGameInCreation", {
        ...currentConfig.value,
        levelSystem: LevelSystem.NORMAL,
      });
    };
    const changeToLevelSystemRandom = (e: Event) => {
      store.commit("updateGameInCreation", {
        ...currentConfig.value,
        levelSystem: LevelSystem.RANDOM,
      });
    };
    const updateMaxPlayerCount = (e: any) => {
      store.commit("updateGameInCreation", {
        ...currentConfig.value,
        maxPlayerCount: Number(e.target.value),
      });
    };
    const updateLevelCount = (e: any) => {
      store.commit("updateGameInCreation", {
        ...currentConfig.value,
        levelCount: Number(e.target.value),
      });
    };

    return {
      maxPlayerCount,
      levelCount,
      levelSystem,
      finalizeGameCreation,
      createGameButton,
      abort,
      abortButton,
      maxPlayerCountLabel,
      levelCountLabel,
      levelSystemNormalLabel,
      levelSystemRandomLabel,
      changeToLevelSystemNormal,
      changeToLevelSystemRandom,
      updateMaxPlayerCount,
      updateLevelCount,
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
.active {
  background-color: #ff6464;
}
.not-active {
  border-color: #ff6464;
  background-color: transparent;
}
.form-entry {
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}
</style>
