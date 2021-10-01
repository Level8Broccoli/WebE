import { createApp } from 'vue'
import { store, key } from './store/store'
import App from './App.vue'

createApp(App).use(store, key).mount('#app')
