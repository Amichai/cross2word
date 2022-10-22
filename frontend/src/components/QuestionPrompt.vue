<template>
<div class="question-prompt">
<div class="question">
  {{clue}}
</div>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
  },

  props: {
    clue: {
      type: String,
      required: true,
    },
  },

  emits: [],

  setup(props, { emit }) {
    return {
    };
  },
});
</script>

<style>
.question-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.question {
  width: 50%;
  font-size: 1.2rem;
  text-align: center;
  /* font-style: italic; */
}
</style>
