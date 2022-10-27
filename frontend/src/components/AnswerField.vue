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
    },
    isSolved: {
      type: Boolean,
      required: true,
    },
    cardId: {
      type: Number,
      required: true,
    },
  },

  emits: ['solved'],

  setup(props, { emit }) {
    console.log("NEW ANSWER FIELD")
    const letterArray = ref([])
    var letterIndex = 0
    letterArray.value = []

    const solvedCardIds = []
    for(var i =0; i < props.letterCount; i+= 1) {
      letterArray.value.push({val: '', isRevealed: false})
    }

    for(var i =0; i < props.revealedLetters.length; i += 1) {
      if(props.revealedLetters[i] !== '') {
        letterArray.value[i].val = props.revealedLetters[i]
        letterArray.value[i].isRevealed = true
      }
    }

    watch(() => props.cardId, (newVal) => {
      console.log(`card id changed ${props.cardId} - ${props.isSolved}`)
      if(props.isSolved) {
        letterArray.value = []
        for(var i =0; i < props.letterCount; i+= 1) {
          letterArray.value.push({val: props.correctAnswer[i], isRevealed: true})
        }
        return
      }

      if(solvedCardIds.includes(props.cardId)) {
        return
      }

      letterArray.value = []
      for(var i =0; i < props.letterCount; i+= 1) {
       letterArray.value.push({val: '', isRevealed: false})
      }
      letterIndex = 0
    }, {
      deep: true,
    })


    const newLetterRevealed = () => {
      console.log(`revealed letters changed ${props.cardId} - ${props.isSolved}`)
      for(var i =0; i < props.revealedLetters.length; i += 1) {
        if(props.revealedLetters[i] !== '') {
          letterArray.value[i].val = props.revealedLetters[i]
        letterArray.value[i].isRevealed = true
        }

        const currentGuess = letterArray.value.map(i => i.val).join('')
        console.log("CURRENT GUESS", currentGuess)
        if(currentGuess.toLowerCase() === props.correctAnswer.toLowerCase() && !props.isSolved){
          console.log("EMITING SOLVED!")
          !props.isSolved && emit('solved', props.cardId)

          solvedCardIds.push(props.cardId)
        }
      }
    }


    window.addEventListener('keydown', (e) => {
      console.log(e)
      if(e.key == "Backspace") {
        if (letterIndex === 0){
          return
        }
        var indexToErase = letterIndex - 1
        
        while (isRevealedAtIndex(indexToErase)) {
          console.log("bb")
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

      if(e.key.length > 1) {
        return
      }

      console.log(`letter index: ${letterIndex} - array len: ${letterArray.value.length}`)

      if (letterIndex >= letterArray.value.length) {
        return
      }

      var canWrite = true
      while(isRevealedAtIndex(letterIndex)) {
        console.log("cc")
        letterIndex += 1
        if(letterIndex === letterArray.value.length) {
          canWrite = false
          break
        }
      }

      if(canWrite) {
        letterArray.value[letterIndex].val = e.key
        letterIndex += 1

        e.stopPropagation()
      }

      const currentGuess = letterArray.value.map(i => i.val).join('')
      console.log("CURRENT GUESS2", currentGuess)
      if(currentGuess.toLowerCase() === props.correctAnswer.toLowerCase() && !props.isSolved){
        !props.isSolved && emit('solved', props.cardId)
        solvedCardIds.push(props.cardId)
      }
    });

    const isRevealedAtIndex = (index) => {
      console.log(`${props.revealedLetters}`)
      return props.revealedLetters.length !== 0 && props.revealedLetters[index] !== ''
    }

    return {
      letterArray,
      isRevealedAtIndex,
      newLetterRevealed,
    };
  },
});
</script>

<style>
  .answer-field {
    display: flex;
  }
</style>
