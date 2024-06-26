import { createWebHashHistory, createRouter } from 'vue-router'

import Test from './components/test.vue'
import Settings from './components/settings.vue'

const routes = [
    { path: '/', component: Settings, name: 'Settings' },
    { path: '/test', component: Test, name: 'Test' },
]

export const router = createRouter({
    history: createWebHashHistory('/' + import.meta.env.VITE_APP_PATH + '/'),
    routes,
})

router.beforeEach((to, from, next) => {
    if(!from.name && to.name === 'Test') next('/')
    else next()
})