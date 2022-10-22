<template>
<div class="root">
  <PageNavbar />
  <div class="home-view">
    <div class="overlay" v-if="isModalVisible" />
    <div class="background" />
    <div class="modalBox" v-if="isModalVisible">
      <div>
        <p>Guess the answers as fast you as you can! </p> 
        <p>Revealing a letter adds to your total time</p>
      </div>
      <button type="button" class="btn btn-primary lets-go-button" @click="hideModal">Ready? LET'S GO!</button>
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
      @solved="currentCardSolved"
    ref="answerFieldRef" />

    <div class="action-buttons"
    >
     <button type="button" class="btn btn-secondary" @click="revealClick">Reveal Letter</button> 
     <button type="button" class="btn btn-secondary" @click="nextClick">Next Card</button> 
    </div>

  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import PageNavbar from './PageNavbar.vue';
import AnswerField from './AnswerField.vue';
import QuestionPrompt from './QuestionPrompt.vue';
import cardData from '../data/cards.json'
import { useStorage } from '@vueuse/core'

export default defineComponent({
  components: {
    PageNavbar,
    AnswerField,
    QuestionPrompt,
  },

  props: {
  },

  emits: [],

  setup(props, { emit }) {
    const isModalVisible = ref(true)

    const totalCardCount = ref(cardData.length)
    const currentCardIndex = ref(0)

    const state = useStorage('session-storage1', {
      count: 0,
      timeElapsed: 0,
      date: '1',
      solvedCount: 0,
      unsolvedCount: cardData.length,
      cards: [],
    })

    const currentCard = computed(() => {
      return state.value.cards[currentCardIndex.value]}
    )

    const currentAnswerLength = computed(() => {
      return currentCard.value.answer.length
    })

    const currentDate = '12'

    if (currentDate != state.value.date) {
      state.value.count = 0
      state.value.timeElapsed = 0
      state.value.date = currentDate
      state.value.solvedCount = 0
      state.value.cards = cardData.map((card) => ({...card, isSolved: false, revealedLetters: []}))
    }
    const timeAtSessionStart = ref(state.value.timeElapsed)
    const totalTimeElapsed = ref(timeAtSessionStart.value)

    
    const solvedCount = state.value.solvedCount
    const unsolvedCount = state.value.unsolvedCount

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
      console.log(emptyLetterCount)
      const letterIndexToFill = randomInt(emptyLetterCount + 1)
      var counterIdx = 0
      for(var i = 0; i < currentCard.value.answer.length; i += 1) {
        if(currentCard.value.revealedLetters[i] !== '') {
          continue
        }

        counterIdx += 1
        if (counterIdx === letterIndexToFill){
          currentCard.value.revealedLetters[i] = currentCard.value.answer[i]
          break
        }
      }
    }

    const nextClick = () => {
      const availableCards = state.value.cards.filter((card) => !card.isSolved)
      for(var i = 1; i <= cardData.length; i += 1) {
        currentCardIndex.value = (currentCardIndex.value + i) % cardData.length
        const matchedCard = state.value.cards.filter((card) => card.id === currentCard.value.id)[0]
        if(!matchedCard.isSolved) {
          break
        }
      }
    }

    const hideModal = () => {
      isModalVisible.value = false

      var startTime = new Date()
      timeAtSessionStart.value = state.value.timeElapsed
      setInterval(() => {
        const currentTime = new Date()
        const elapsed = (currentTime - startTime) / 1000.0
        totalTimeElapsed.value = Math.round(elapsed + timeAtSessionStart.value)
        state.value.timeElapsed = totalTimeElapsed.value
      }, 300)
    }

    const currentCardSolved = () => {
      debugger
    }

    return {
      isModalVisible,
      hideModal,
      state,
      totalTimeElapsed,
      revealClick,
      nextClick,
      totalCardCount,
      currentCardIndex,
      solvedCount,
      unsolvedCount,
      currentCard,
      currentAnswerLength,
      currentCardSolved,
    };
  },
});
</script>

<style>

.home-view {
  display: flex;
  flex-direction:column;
  align-items: center;
  background-color: black;
  color: white;
  padding: 0 6rem;
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
</style>
