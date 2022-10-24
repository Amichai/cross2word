<template>
<div class="root">
  <PageNavbar />
  <div class="home-view">
    <div class="overlay" v-if="isModalVisible" />
    <div class="background" />
    <div class="modalBox" v-if="isModalVisible">
      <div>
        <p>{{modalLine1}}</p> 
        <p>{{modalLine2}}</p>
      </div>
      <button type="button" class="btn btn-primary lets-go-button" @click="hideModal">{{modalButton}}</button>
    </div>

    
    <div class="status-bar">
      <a style="font-size:2rem; color: white" href="/">
        <i class="bi-pause icon"></i>
      </a>
      <span>
        <i class="bi-clock icon"></i> {{totalTimeElapsed}}s
      </span>

    </div>
      <span style="color: gray">Card {{currentCardIndex + 1}} of {{totalCardCount}}</span>
      <span style="color: gray">Solved: {{solvedCount}}</span>
      <span style="color: gray">Unsolved: {{unsolvedCount}}</span>

      <br />
      
    
    <QuestionPrompt
      :clue="currentCard.clue"
      :answer="currentCard.answer"
     />
     <br />
     <span class="prompt">what is ...</span>
    <AnswerField 
      :letterCount="currentAnswerLength" 
      :revealedLetters="currentCard.revealedLetters"
      :correctAnswer="currentCard.answer"
      :isSolved="currentCard.isSolved"
      :cardId="currentCard.id"
      @solved="currentCardSolved"
    ref="answerFieldRef" />

    <div class="action-buttons"
    >
     <button type="button" class="btn btn-secondary" @click="prevClick" @focus="blur">
        <i class="bi-arrow-left icon"></i>
      </button> 

     <button type="button" class="btn btn-secondary" @click="revealClick" @focus="blur">Reveal Letter</button> 
     <button type="button" class="btn btn-secondary" @click="nextClick" @focus="blur">
      <i class="bi-arrow-right icon"></i>
      </button> 
    </div>

  </div>

  <Fireworks
    v-if="fireworksEnabled"
    class="fireworks"
    :style="{
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      position: 'fixed',
      background: 'transparent',
    }"
  />
</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import PageNavbar from './PageNavbar.vue';
import AnswerField from './AnswerField.vue';
import QuestionPrompt from './QuestionPrompt.vue';
import cardData from '../data/cards.json'
import { useStorage } from '@vueuse/core'

import { Fireworks } from '@fireworks-js/vue'
import type { FireworksOptions } from '@fireworks-js/vue'

export default defineComponent({
  components: {
    PageNavbar,
    AnswerField,
    QuestionPrompt,
    Fireworks,
  },

  props: {
  },

  emits: [],

  setup(props, { emit }) {

    const totalCardCount = ref(cardData.length)
    const currentCardIndex = ref(0)

    const modalLine1 = ref('Guess the answers as fast you as you can!')
    const modalLine2 = ref('Revealing a letter adds to your total time')
    const modalButton = ref("LET'S GO!")

    const state = useStorage('session-storage1', {
      count: 0,
      timeElapsed: 0,
      date: '1',
      cards: [],
    })

    const currentCard = computed(() => {
      return state.value.cards[currentCardIndex.value]}
    )

    const currentAnswerLength = computed(() => {
      return currentCard.value.answer.length
    })

    const currentDate = '20' + state.value.cards.length

    if (currentDate != state.value.date) {
      state.value.count = 0
      state.value.timeElapsed = 0
      state.value.date = currentDate
      state.value.cards = cardData.map((card) => ({...card, isSolved: false, revealedLetters: []}))
    }
    const timeAtSessionStart = ref(state.value.timeElapsed)
    const totalTimeElapsed = ref(timeAtSessionStart.value)

    
    const solvedCount = computed(() => state.value.cards.filter((card) => card.isSolved).length)
    const unsolvedCount = computed(() => state.value.cards.filter((card) => !card.isSolved).length)


    const fireworksEnabled = ref(false)

    if(unsolvedCount.value === 0) {
        fireworksEnabled.value = true

        modalLine1.value = `Solved in ${totalTimeElapsed.value} Seconds!`
        modalLine2.value = ''
        modalButton.value = "Review My Answers"
    }

    const isModalVisible = ref(true)

    const revealPenalty = ref(0)

    const randomInt = (max) => {
      return Math.floor(Math.random() * max);
    }


    const revealClick = () => {
      const matchedCard = state.value.cards.filter((card) => card.id === currentCard.value.id)[0]
      if(matchedCard.revealedLetters.length === 0) {
        for(var i = 0; i < matchedCard.answer.length; i+= 1) {
          matchedCard.revealedLetters.push('')
        }
      }

      const emptyLetterCount = matchedCard.revealedLetters.filter((i) => i === '').length
      const letterIndexToFill = randomInt(emptyLetterCount + 1)
      var counterIdx = 0
      for(var i = 0; i < currentCard.value.answer.length; i += 1) {
        if(currentCard.value.revealedLetters[i] !== '') {
          continue
        }

        counterIdx += 1
        if (counterIdx === letterIndexToFill){
          currentCard.value.revealedLetters[i] = currentCard.value.answer[i]
          revealPenalty.value += 300
          break
        }
      }
    }

    const nextClick = () => {
      currentCardIndex.value = (currentCardIndex.value + 1) % cardData.length
    }
    
    const prevClick = () => {
      currentCardIndex.value = (currentCardIndex.value - 1) % cardData.length
      while(currentCardIndex.value < 0) {
        currentCardIndex.value += cardData.length
      }
    }

    window.addEventListener('keydown', (e) => {
      // console.log(e)
      if(e.key === "ArrowLeft") {
        prevClick()
      }
      else if(e.key === "ArrowRight") {
        nextClick()
      }

    })

    const hideModal = () => {
      isModalVisible.value = false

      var startTime = new Date()
      timeAtSessionStart.value = state.value.timeElapsed
      setInterval(() => {
        if(unsolvedCount.value === 0) {
          return
        }
        const currentTime = new Date()
        const elapsed = (currentTime - startTime) / 1000.0
        totalTimeElapsed.value = Math.round(elapsed + timeAtSessionStart.value + revealPenalty.value)
        state.value.timeElapsed = totalTimeElapsed.value
      }, 300)
    }


    const currentCardSolved = () => {
      currentCard.value.revealedLetters = currentCard.value.answer.split('')
      currentCard.value.isSolved = true

      if(unsolvedCount.value === 0) {
        fireworksEnabled.value = true
        modalLine1.value = `Solved in ${totalTimeElapsed.value} Seconds!`
        modalLine2.value = ''
        modalButton.value = "Review My Answers"
      }
    }

    const blur = (evt) => {
      evt.target.blur()
    }


    


    return {
      isModalVisible,
      hideModal,
      state,
      totalTimeElapsed,
      revealClick,
      nextClick,
      prevClick,
      totalCardCount,
      currentCardIndex,
      solvedCount,
      unsolvedCount,
      currentCard,
      currentAnswerLength,
      currentCardSolved,
      fireworksEnabled,

      blur,

      modalLine1,
      modalLine2,
      modalButton,
    };
  },
});
</script>

<style>

.home-view {
  display: flex;
  flex-direction:column;
  align-items: center;
  color: white;
  padding: 0 3rem;
}
.overlay {
  background-color: gray;
  position: absolute;
  width: 100%;
  top:0;
  height: 100%;
  opacity: 0.5;
}

.modalBox {
  background-color: black;
  z-index: 1;
  position: absolute;
  color: white;
  top: 20%;
  bottom: 20%;
  width: 60%;
  display: flex;
  flex-direction: column;
  padding: 2em;
  border-radius: 1rem;
  align-items: center;
  justify-content: space-between;

  font-family: "nyt-karnakcondensed";
  font-weight: 700;
  font-size: 18px;
}

.lets-go-button {
  max-width: 15rem;
  font-family: "nyt-franklin";
}

.input-field-root {
  padding: 3rem;
  width: 90%;
  max-width: 50rem;
}

.status-bar {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;

}

.prompt {
  font-style: italic;
  color: gray;
}

.background {
  background-color: black;
  position: absolute;
  width: 100%;
  top:0;
  height: 100%;
  z-index: -1;
}

.action-buttons {
  padding: 3rem;
  display: flex;
  gap: 2rem;
}

.fireworks {
  z-index: -1;
}
</style>
