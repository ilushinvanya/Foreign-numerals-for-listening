import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import { Quasar, Notify } from 'quasar'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// A few examples for animations from Animate.css:
// import @quasar/extras/animate/fadeIn.css
// import @quasar/extras/animate/fadeOut.css

// Import Quasar css
import 'quasar/src/css/index.sass'

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './app.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(Quasar, {
    plugins: { Notify },
})
app.mount('#app')