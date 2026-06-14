import {
  createRouter,
  createWebHistory,
  type RouteLocationRaw,
  type RouteRecordRaw,
} from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { useGameStore } from '@/stores/game'
import type { Pinia } from 'pinia'
import GameOverView from '@/views/GameOverView.vue'
import GameView from '@/views/GameView.vue'

const baseRoutes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/:pathMatch(.*)*', redirect: '/' },
] satisfies RouteRecordRaw[]

export const routes: RouteRecordRaw[] = [
  ...baseRoutes,
  { path: '/play', name: 'play', component: () => import('@/views/GameView.vue') },
  { path: '/game-over', name: 'game-over', component: () => import('@/views/GameOverView.vue') },
]

export const eagerRoutes: RouteRecordRaw[] = [
  ...baseRoutes,
  { path: '/play', name: 'play', component: GameView },
  { path: '/game-over', name: 'game-over', component: GameOverView },
]

export const createAppRouter = (
  piniaInstance: Pinia,
  history = createWebHistory(import.meta.env.BASE_URL),
  routeList = routes,
) => {
  const router = createRouter({
    history,
    routes: routeList,
  })
  router.beforeEach((to) => {
    const store = useGameStore(piniaInstance)

    const rules: Partial<Record<string, () => RouteLocationRaw | undefined>> = {
      play: () => {
        if (!store.isGameActive)
          return store.gameOver.isOver ? { name: 'game-over' } : { name: 'home' }
      },
      'game-over': () => {
        if (!store.gameOver.isOver) return { name: 'home' }
      },
    }

    return rules[to.name as string]?.()
  })

  return router
}
