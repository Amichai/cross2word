<template>
<div>
  <div v-for="(ct, idx) in resultArray" :key="idx">
    {{`🟩`.repeat(ct)}}
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
      default: [3,3,2,1,0,1,0],
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
</style>
