import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../components/HomeView.vue';
import CardDeck from '../components/CardDeck.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    props: true,
  },
  {
    path: '/deck/:deckId',
    name: 'Deck',
    component: CardDeck,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
