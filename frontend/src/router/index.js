import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../components/HomeView.vue';
import CardDeck from '../components/CardDeck.vue';
import NewDeck from '../components/NewDeck.vue';

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
  {
    path: '/new',
    name: 'New',
    component: NewDeck,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
