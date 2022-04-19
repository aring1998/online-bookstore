import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'

import { createPinia } from 'pinia'

import router from './router'

const app = createApp(App)
app.use(ElementPlus, { locale })
app.use(createPinia())
app.use(router)
app.mount('#app')
