import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { BlogService } from './services/BlogService'
import { BLOG_SERVICE_KEY } from './composables/useBlogService'

const app = createApp(App)

app.provide(BLOG_SERVICE_KEY, new BlogService())
app.use(router)

app.mount('#app')
