import { createWebHistory, createRouter } from 'vue-router'

import Game from './components/game.vue'
import Settings from './components/settings.vue'

const routes = [
    { path: '/', component: Settings },
    { path: '/game', component: Game },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
})
