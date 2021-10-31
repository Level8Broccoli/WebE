<template>
  <div v-if="isActivePlayer">
    {{ i18n.yourTurn }}
    {{ currentStep }}. <br />
    <em> {{ currentStepExplanation }} </em>
    <br />
    <button v-if="isInLevelFulfillStep" @click.prevent="skipLevelFulfillStep">
      Überspringen
    </button>
  </div>
  <div v-else>
    {{ i18n.pleaseWaitOnPlayer }}
    <em>{{ currentPlayerName }}</em>
    ({{ currentStep }})
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { Game } from "../../../shared/model/Game";
import { key } from "../../store/store";

export default defineComponent({
  name: "NextStep",
  setup() {
    const store = useStore(key);
    const isActivePlayer = computed(() => store.getters.amIActivePlayer);
    const i18n = computed(() => store.getters.i18n);
    const currentStep = computed(() =>
      store.getters.translateCurrentStep(store.getters.getCurrentStep)
    );
    const currentStepExplanation = computed(() =>
      store.getters.translateCurrentStepExplanation(
        store.getters.getCurrentStep
      )
    );
    const isInLevelFulfillStep = computed(
      () => isActivePlayer.value && store.getters.getCurrentStep === 1
    );
    const currentPlayerName = computed(() => {
      const game: Game = store.getters.getActiveGame;
      const activePlayerId = game.state.activePlayerId;
      return store.getters.getPlayerName(activePlayerId) || activePlayerId;
    });

    const skipLevelFulfillStep = (e: Event) => {
      store.commit("skipLevelFulfillStep");
    };

    return {
      isActivePlayer,
      currentStep,
      currentPlayerName,
      currentStepExplanation,
      i18n,
      isInLevelFulfillStep,
      skipLevelFulfillStep,
    };
  },
});
</script>
