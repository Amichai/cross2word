<template>
<div class="result-component">
  <div v-for="(letters, idx) in resultArray" :key="idx">
    <span v-for="(letter, idx2) in letters" :key="idx2">
      <!-- {{letter ? `🔲` : `🟩` }} -->
      {{letter ? `🟩` :`🔲` }}
    </span>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
  },

  props: {
    resultArray: {
      type: Array,
      default: [],
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
.result-component {
  font-size: 0.9rem;
}
</style>

