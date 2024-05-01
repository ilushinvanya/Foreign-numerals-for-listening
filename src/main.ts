import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar, Notify, Dialog, Loading } from 'quasar'
import { router } from './router'


// A few examples for animations from Animate.css:
// import @quasar/extras/animate/fadeIn.css
// import @quasar/extras/animate/fadeOut.css

import 'quasar/src/css/index.sass'
import './styles/style.sass'

import App from './app.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Quasar, {
    plugins: { Notify, Dialog, Loading },
})
app.mount('#app')