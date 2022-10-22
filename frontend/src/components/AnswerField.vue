<template>
<div class="answer-field">
  <div v-for="(letter, index) in letterArray" :key="`${index}-${letter}`">
    <LetterBox 
    :value="letter" 
    :isRevealed="isRevealedAtIndex(index)"
     />
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import LetterBox from './LetterBox.vue';

export default defineComponent({
  components: {
    LetterBox,
  },

  props: {
    letterCount: {
      type: Number,
      required: true
    },
    revealedLetters: {
      type: Array,
      required: true,
    },
    correctAnswer: {
      type: String,
      required: true,
    }
  },

  emits: ['solved'],

  setup(props, { emit }) {

    const letterArray = ref([])
    var letterIndex = 0
    letterArray.value = []
    for(var i =0; i < props.letterCount; i+= 1) {
      letterArray.value.push('')
    }

    for(var i =0; i < props.revealedLetters.length; i += 1) {
      if(props.revealedLetters[i] !== '') {
        letterArray.value[i] = props.revealedLetters[i]
      }
    }

    watch(() => props.letterCount, (newVal) => {
      console.log(newVal)
      letterArray.value = []
      for(var i =0; i < props.letterCount; i+= 1) {
       letterArray.value.push('')
      }
      letterIndex = 0
    })

    watch(() => props.revealedLetters, (newVal) =>{
      for(var i =0; i < props.revealedLetters.length; i += 1) {
        if(props.revealedLetters[i] !== '') {
          letterArray.value[i] = props.revealedLetters[i]
        }
      }
    }, {
      deep: true,
    })


    window.addEventListener('keydown', (e) => {
      console.log(e.key)

      if(e.key == "Backspace") {
        if (letterIndex === 0){
          return
        }
        var indexToErase = letterIndex - 1
        
        while (isRevealedAtIndex(indexToErase)) {
          if (indexToErase === 0) {
            indexToErase = letterIndex
            break
          }
          indexToErase -= 1

        }
        if(indexToErase !== letterIndex) {
          letterArray.value[indexToErase] = ''
          letterIndex -= 1
        }
        return
      }

      if(e.key.length > 1) {
        return
      }

      if (letterIndex >= letterArray.value.length) {
        return
      }

      var canWrite = true
      while(isRevealedAtIndex(letterIndex)) {
        letterIndex += 1
        if(letterIndex === letterArray.value.length) {
          canWrite = false
          break
        }
      }

      if(canWrite) {
        letterArray.value[letterIndex] = e.key
        letterIndex += 1
      }

      console.log(letterArray.value)
      const currentGuess = letterArray.value.join('')
      if(currentGuess.toLowerCase() === props.correctAnswer.toLowerCase()){ 
        emit('solved')
      }
    });

    const isRevealedAtIndex = (index) => {
      return props.revealedLetters.length !== 0 && props.revealedLetters[index] !== ''
    }

    return {
      letterArray,
      isRevealedAtIndex,
    };
  },
});
</script>

<style>
  .answer-field {
    display: flex;
  }
</style>
