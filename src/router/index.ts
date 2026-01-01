import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../components/PortfolioPage.vue'),
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => import('../views/blog/BlogIndex.vue'),
    },
    {
      path: '/blog/:slug',
      name: 'blog-post',
      component: () => import('../views/blog/BlogPost.vue'),
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('../views/admin/AdminDashboard.vue'),
    },
    {
      path: '/admin/posts/:id',
      name: 'admin-post-editor',
      component: () => import('../views/admin/PostEditor.vue'),
    },
  ],
})

export default router
