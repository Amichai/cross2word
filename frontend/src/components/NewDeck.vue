<template>
<div class="new-deck">
  <PageNavbar />
  <div class="category-header">
    <p style="font-weight: bold">Category:</p>
    <input 
        type="text"
        v-model="category"
        class="input-field" 
      />
    </div>

  <div class="card-list">
    <div v-for="(card, idx) in cardComponents" :key="idx">
      Card #{{idx + 1}}
      <component
        :is="card"
        @deleteCard="() => deleteCard(idx)"
        @updateModel="(newVal) => updateModel(newVal, idx)"
      />
    </div>

    <button type="button" class="btn btn-secondary" @click="newCard">
      <i class="bi bi-plus-square-fill"></i>
    </button>
    <button type="button" class="btn btn-primary done-button" @click="done">
      Done!
    </button>
  </div>
</div>
</template>

<script lang="ts">
import { defineComponent, markRaw, ref } from 'vue';
import PageNavbar from './PageNavbar.vue';
import EditCard from './EditCard.vue';
import ShortUniqueId from 'short-unique-id';
import { useRouter, useRoute } from 'vue-router';

export default defineComponent({
  components: {
    PageNavbar,
    EditCard,
  },

  props: {
  },

  emits: [],

  setup(props, { emit }) {
    const cardComponents = ref([
      markRaw(EditCard),
      markRaw(EditCard),
    ])

    const router = useRouter()

    const cardList = [{question: '', answer: ''}, {question: '', answer: ''}]

    const category = ref('')

    const deleteCard = (idx) =>{
      console.log("DELETE CARD", idx)
      cardComponents.value.splice(idx, 1)
    }

    const newCard = () => {
      console.log("NEW CARD")
      cardComponents.value.push(markRaw(EditCard))
      cardList.push({question: '', answer: ''})
    }

    const updateModel = (newVal, idx) => {
      cardList[idx] = newVal

      console.log(cardList)
    }

    const sleep = (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const uid = new ShortUniqueId()

    const done = () => {
      const id = uid()
      const cards = cardList.map((card, idx) => ({
        id: idx,
        clue: card.question,
        answer: card.answer,
      }))

      const body = JSON.stringify({
          id,
          cards: encodeURI(JSON.stringify(cards)),
          category: category.value,
          timestamp: new Date().toISOString(),
      })
      
      fetch('https://hohi6i7j51.execute-api.us-east-1.amazonaws.com/dev/id/0', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body,
      }).then((response) => {
          response.json().then(result => {
            sleep(600)
            router.push({path: '/', query: { 'p': id }})
        })
      })

    }

    return {
      newCard,
      cardComponents,
      deleteCard,
      updateModel,
      done,
      category,
    };
  },
});
</script>

<style>
.new-deck {
  display: flex;
  flex-direction: column;
}

.card-list {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.done-button {
  margin: 1rem;
}

.category-header {
  margin: 1rem;
  display: flex;
  align-items: baseline;
  justify-content: center;
}
</style>
