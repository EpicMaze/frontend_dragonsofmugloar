import { createRouter, createWebHistory, type RouteLocationRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useGameStore } from '@/stores/game'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/play',
    name: 'play',
    component: () => import('@/views/GameView.vue'),
  },
  {
    path: '/game-over',
    name: 'game-over',
    component: () => import('@/views/GameOverView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const store = useGameStore()
  const { isGameActive, gameOver } = store

  const rules: Partial<Record<string, () => RouteLocationRaw | undefined>> = {
    play: () => {
      if (!isGameActive) return gameOver.isOver ? { name: 'game-over' } : { name: 'home' }
    },
    'game-over': () => {
      if (!gameOver.isOver) return { name: 'home' }
    },
  }

  return rules[to.name as string]?.()
})

export default router
