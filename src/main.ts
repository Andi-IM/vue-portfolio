import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { BlogService } from './services/BlogService'
import { MockBlogService } from './services/MockBlogService'
import { BLOG_SERVICE_KEY } from './composables/useBlogService'

const app = createApp(App)

const blogService = window.USE_MOCK_SERVICES ? new MockBlogService() : new BlogService()

app.provide(BLOG_SERVICE_KEY, blogService)
app.use(router)

app.mount('#app')
