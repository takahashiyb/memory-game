import { createRouter, createWebHashHistory } from 'vue-router'
import StartPage from '@/pages/StartPage.vue'
import GameBoard from '@/pages/GameBoard.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'startPage', component: StartPage },
    {
      path: '/GamePage',
      name: 'gamePage',
      component: GameBoard,
      props: true,
      beforeEnter: (to) => {
        if (!to.query.theme || !to.query.players || !to.query.size) {
          return { name: 'startPage' }
        } else {
          return
        }
      },
    },
  ],
})

export default router
