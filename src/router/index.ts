import { createRouter, createWebHistory } from 'vue-router'
import StartPage from '@/pages/StartPage.vue'
import GameBoard from '@/pages/GameBoard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'startPage', component: StartPage },
    {
      path: '/GamePage',
      name: 'gamePage',
      component: GameBoard,
      props: true,
    },
  ],
})

export default router
