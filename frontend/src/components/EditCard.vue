<template>
  <div class="edit-card">
    <i class="bi bi-trash-fill trash-icon" @click="deleteCard" />
    <textarea 
      type="text" 
      placeholder="Prompt" 
      class="question-area input-field" 
      v-model="question"
      @blur="blur"
    />
    <input 
      type="text"
      placeholder="One Word Answer"
      v-model="answer"
      class="input-field" 
      @blur="blur"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  components: {
  },

  props: {
  },

  emits: ['deleteCard', 'updateModel'],

  setup(props, { emit }) {
    const question = ref('')
    const answer = ref('')

    const deleteCard = () => {
      emit('deleteCard')
    }

    const blur = () => {
      emit('updateModel', { 
        question: question.value,
        answer: answer.value,
      })
    }

    return {
      deleteCard,
      question,
      answer,
      blur,
    };
  },
});
</script>

<style>
.edit-card {
  width: 50rem;
  background-color: lightgray;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-bottom: thick double black;
}

.question-area {
  resize: none;
}

.trash-icon {
  cursor: pointer;
}
</style>
