import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
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
  {
    path: '/admin/new',
    redirect: '/admin/posts/new',
  },
];

export default routes;
