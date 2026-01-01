<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import RichTextRenderer from '../../components/blog/RichTextRenderer.vue';

const route = useRoute();
const post = ref<any>(null);
const loading = ref(true);

onMounted(async () => {
    // In a real app we would query by slug, but here we might need to find the ID from the slug
    // or assume the simple implementation uses ID lookup or slug in the KV key.
    // To simplify, let's assume we can fetch all and find, OR improve API to fetch by slug.
    // For now, let's fetch all (index) and match slug, then fetch full content by ID.
    // Optimization: Store mapped slug->id KV pairs.
    try {
        const slugOrId = route.params.slug as string;

        // 1. Fetch index to find ID if slug provided
        const indexRes = await fetch('/api/posts');
        const index = await indexRes.json();

        const meta = index.find((p: any) => p.slug === slugOrId || p.id === slugOrId);

        if (meta) {
             const res = await fetch(`/api/posts?id=${meta.id}`);
             if (res.ok) {
                post.value = await res.json();
             }
        }
    } catch (e) {
        console.error(e);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else-if="!post" class="text-center">Post not found</div>
    <article v-else class="space-y-8">
        <div class="text-center space-y-4">
             <time class="text-zinc-400 dark:text-zinc-500">{{ new Date(post.createdAt).toLocaleDateString() }}</time>
             <h1 class="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white">{{ post.title }}</h1>
        </div>

        <div v-if="post.coverImage" class="w-full aspect-video rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shadow-lg">
             <img :src="post.coverImage" :alt="post.title" class="object-cover w-full h-full" />
        </div>

        <RichTextRenderer :content="post.content" />
    </article>
  </div>
</template>
