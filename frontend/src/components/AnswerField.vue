<template>
<div class="answer-field">
  <div v-for="(letter, index) in letterArray" :key="`${index}-${letter}`">
    <LetterBox 
    :value="letter.val" 
    :isRevealed="letter.isRevealed"
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
  },

  emits: ['solved'],

  setup(props, { emit }) {
    console.log("NEW ANSWER FIELD")
    const letterArray = ref([])
    var letterIndex = 0
    letterArray.value = []
    const isCardSolved = ref(false)
    const currentCardId = ref(-1)
    const currentCorrectAnswer = ref('')

    const checkIfSolved = () => {
      const currentGuess = letterArray.value.map(i => i.val).join('')
      console.log("CURRENT GUESS2", currentGuess)
      if(currentGuess.toLowerCase() === currentCorrectAnswer.value.toLowerCase() && !isCardSolved.value){
        !isCardSolved.value && emit('solved', currentCardId.value)
        // solvedCardIds.push(currentCardId.value)
      }
    }

    const newLetterRevealed = (revealedLetters) => {
      revealedLetters.forEach((letter, idx) => {
        if (letter != '') {
          letterArray.value[idx] = {
            val: letter,
            isRevealed: true
          }
        }
      })

      checkIfSolved()
    }

    const setCurrentAnswer = (revealedLetters, isSolved, cardId, correctAnswer) => {
      letterIndex = 0
      letterArray.value = revealedLetters.map((letter) => ({
        val: letter,
        isRevealed: letter != ''
      }))
      
      isCardSolved.value = isSolved
      currentCardId.value = cardId
      currentCorrectAnswer.value = correctAnswer
    }

    const keyPressed = (key, evt) => {
      if(key === "Backspace" || key === "{backspace}") {
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
          letterIndex -= 1
        }

        if(indexToErase !== letterIndex) {
          letterArray.value[indexToErase].val = ''
          letterIndex -= 1
        }
        return
      }

      if(key.length > 1) {
        return
      }

      console.log(`letter index: ${letterIndex} - array len: ${letterArray.value.length}`)

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
        letterArray.value[letterIndex].val = key
        letterIndex += 1

        evt?.stopPropagation()
      }

      checkIfSolved()
    }

    window.addEventListener('keydown', (e) => {
      keyPressed(e.key, e)
    });

    const isRevealedAtIndex = (index) => {
      return letterArray.value[index].isRevealed
    }

    return {
      letterArray,
      isRevealedAtIndex,
      newLetterRevealed,
      keyPressed,
      setCurrentAnswer,
    };
  },
});
</script>

<style>
  .answer-field {
    display: flex;
  }
</style>
