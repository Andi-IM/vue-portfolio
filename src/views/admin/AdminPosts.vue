<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import AdminLayout from '@/components/admin/AdminLayout.vue';
import { useBlogService } from '../../composables/useBlogService';
import type { BlogPostIndex } from '../../types/blog';

const blogService = useBlogService();
const posts = ref<BlogPostIndex[]>([]);
const views = ref<Record<string, number>>({});

const fetchPosts = async () => {
  try {
    const [fetchedPosts, fetchedViews] = await Promise.all([
      blogService.getPosts(),
      blogService.getAllViews(),
    ]);
    posts.value = fetchedPosts;
    views.value = fetchedViews;
  } catch (e) {
    console.error(e);
  }
};

const deletePost = async (id: string) => {
  if (!confirm('Are you sure you want to delete this post?')) return;

  try {
    await blogService.deletePost(id);
    await fetchPosts();
  } catch (e) {
    console.error(e);
    alert('Failed to delete');
  }
};

onMounted(() => {
  void fetchPosts();
});
</script>

<template>
  <AdminLayout>
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-3xl font-bold">Manage Posts</h1>
      <RouterLink
        to="/admin/new"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
      >
        <span>+</span> New Post
      </RouterLink>
    </div>

    <div
      class="bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-800 overflow-hidden"
    >
      <table class="w-full text-left">
        <thead class="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <tr>
            <th class="p-4 font-semibold text-zinc-700 dark:text-zinc-300">Title</th>
            <th class="p-4 font-semibold text-zinc-700 dark:text-zinc-300">Views</th>
            <th class="p-4 font-semibold text-zinc-700 dark:text-zinc-300">Created At</th>
            <th class="p-4 font-semibold text-zinc-700 dark:text-zinc-300 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-zinc-200 dark:divide-zinc-800">
          <tr
            v-for="post in posts"
            :key="post.id"
            class="hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          >
            <td class="p-4">
              <RouterLink
                :to="`/admin/posts/${post.id}`"
                class="font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
              >
                {{ post.title }}
              </RouterLink>
            </td>
            <td class="p-4 text-zinc-600 dark:text-zinc-400">{{ views[post.id] || 0 }}</td>
            <td class="p-4 text-zinc-500">{{ new Date(post.createdAt).toLocaleDateString() }}</td>
            <td class="p-4 text-right space-x-2">
              <RouterLink :to="`/admin/posts/${post.id}`" class="text-blue-600 hover:text-blue-500"
                >Edit</RouterLink
              >
              <button @click="deletePost(post.id)" class="text-red-600 hover:text-red-500">
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="posts.length === 0">
            <td colspan="4" class="p-8 text-center text-zinc-500">No posts yet.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminLayout>
</template>
