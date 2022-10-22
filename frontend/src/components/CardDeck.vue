<template>
<div>
 {{cardData}}

 <button
      type="button"
      :class="[
        'btn', 'btn-default', 'more-button', 'bi-arrow-down-short',
      ]"
      @click="increment"
    >
      +1
    </button>
  <div>{{state.count}}</div>
 </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import cardData from '../data/cards.json'
import { useStorage } from '@vueuse/core'



export default defineComponent({
  components: {
  },

  props: {
    deckId: {
      type: String,
      default: '',
    },
  },

  emits: [],

  setup(props, { emit }) {
    /// Display how long we've been working on this deck, points
    //PICK A CARD FROM THE DECK AT RANDOM
    // DISPLAY THE PROMPT AND THE ANSWER FIELD (WORDLE STYLE)
    //NEXT BUTTON, TRACK SCORE AND TIME
    // show completed cards at the bottom

    const state = useStorage('session-storage', {
      name: 'Banana',
      color: 'Yellow',
      size: 'Medium',
      count: 0,
    })

    const increment = () => {
      state.value.count += 1
    }

    return {
      cardData,
      state,
      increment,
    };
  },
});
</script>

<style>
</style>
