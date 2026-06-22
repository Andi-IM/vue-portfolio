<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import AdminLayout from '@/components/admin/AdminLayout.vue';
import { useBlogService } from '../../composables/useBlogService';
import type { BlogPostIndex } from '../../types/blog';
import { LayoutDashboard, BookOpen, BarChart3, TrendingUp } from 'lucide-vue-next';

const blogService = useBlogService();
const posts = ref<BlogPostIndex[]>([]);
const views = ref<Record<string, number>>({});
const loading = ref(true);

const fetchStats = async () => {
  try {
    const [fetchedPosts, fetchedViews] = await Promise.all([
      blogService.getPosts(),
      blogService.getAllViews(),
    ]);
    posts.value = fetchedPosts;
    views.value = fetchedViews;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const totalPosts = computed(() => posts.value.length);
const totalViews = computed(() => Object.values(views.value).reduce((a, b) => a + b, 0));

// Sort posts by views for the "trend" visualization
const topPosts = computed(() => {
  return [...posts.value]
    .map((post) => ({
      ...post,
      viewCount: views.value[post.id] || 0,
    }))
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);
});

const maxViews = computed(() => Math.max(...topPosts.value.map((p) => p.viewCount), 1));

onMounted(() => {
  void fetchStats();
});
</script>

<template>
  <AdminLayout>
    <div class="dashboard-container">
      <header class="dashboard-header mb-8">
        <h1 class="text-3xl font-bold flex items-center gap-3">
          <LayoutDashboard class="text-blue-600" />
          Dashboard Overview
        </h1>
        <p class="text-zinc-500 mt-2">Welcome back! Here's what's happening with your blog.</p>
      </header>

      <!-- Stat Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div class="stat-card">
          <div class="stat-icon bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <BookOpen :size="24" />
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Posts</span>
            <span class="stat-value">{{ totalPosts }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div
            class="stat-icon bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
          >
            <TrendingUp :size="24" />
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Views</span>
            <span class="stat-value">{{ totalViews.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Views Trend Visualization -->
      <section class="dashboard-section mb-10">
        <div class="section-header flex items-center gap-2 mb-6">
          <BarChart3 class="text-zinc-400" :size="20" />
          <h2 class="text-xl font-semibold">Views Trend (Top Posts)</h2>
        </div>

        <div
          class="trend-wrapper bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800"
        >
          <div v-if="loading" class="flex justify-center py-12">
            <span class="text-zinc-500">Loading statistics...</span>
          </div>

          <div v-else-if="topPosts.length === 0" class="flex justify-center py-12">
            <span class="text-zinc-500">No data available yet. Start posting!</span>
          </div>

          <div v-else class="space-y-6">
            <div v-for="post in topPosts" :key="post.id" class="trend-item">
              <div class="flex justify-between items-center mb-2">
                <span
                  class="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate max-w-[70%]"
                >
                  {{ post.title }}
                </span>
                <span class="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {{ post.viewCount }} views
                </span>
              </div>
              <div class="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  class="h-full bg-blue-600 transition-all duration-1000 ease-out"
                  :style="{ width: `${(post.viewCount / maxViews) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </AdminLayout>
</template>

<style scoped>
.dashboard-container {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  padding: 1.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
  border-color: var(--color-border-hover);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-heading);
}

.trend-item {
  position: relative;
}
</style>
