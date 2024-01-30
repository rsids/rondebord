import './assets/main.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)
library.add(faArrowUp, faArrowDown)
app.use(createPinia())
app.use(router)

app.mount('#app')
