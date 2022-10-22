<template>
<div 
  :class="['letter-box', isRevealed && 'is-revealed']"
>
  {{value}}
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
  },

  props: {
    value: {
      type: String,
      required: true,
    },
    isRevealed: {
      type: Boolean,
      default: false,
    }
  },

  emits: [],

  setup(props, { emit }) {
    return {
    };
  },
});
</script>

<style>
  .letter-box {
    border: 2px solid #3a3a3c;
    font-size: 1em;
    margin: 1px;
    width: 1.5em;
    height: 1.5em;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    text-transform: uppercase;
  }
  .is-revealed {
    background-color: #538d4e;
  }
</style>
