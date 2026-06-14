import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createQueryClient } from '@/lib/queryClient'
import App from './App.vue'
import './assets/main.css'
import { createAppRouter } from './router/index.ts'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const queryClient = createQueryClient(pinia)
const router = createAppRouter(pinia)

app.use(pinia)
app.use(router)
app.use(VueQueryPlugin, { queryClient })

app.mount('#app')
