<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RichTextEditor from '../../components/blog/RichTextEditor.vue'
import { useBlogService } from '../../composables/useBlogService'
import type { BlogPost } from '../../types/blog'

const route = useRoute()
const router = useRouter()
const blogService = useBlogService()
const isNew = route.params.id === 'new'

const form = ref<BlogPost>({
  id: '',
  title: '',
  slug: '',
  excerpt: '',
  coverImage: '',
  content: [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ] as any, // Default empty state for Slate
})

const loading = ref(false)

onMounted(async () => {
  if (!isNew) {
    try {
      const post = await blogService.getPost(route.params.id as string)
      form.value = post
    } catch (e) {
      console.error(e)
    }
  }
})

const save = async () => {
  if (!form.value.title) return alert('Title is required')

  // Auto generate slug if empty
  if (!form.value.slug) {
    form.value.slug = form.value.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  loading.value = true
  try {
    await blogService.savePost(form.value)
    alert('Saved!')
    router.push('/admin')
  } catch (e) {
    console.error(e)
    alert('Error saving')
  } finally {
    loading.value = false
  }
}

const handleImageUpload = async (file: File): Promise<string> => {
  return await blogService.uploadImage(file)
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold">{{ isNew ? 'New Post' : 'Edit Post' }}</h1>
      <div class="space-x-4">
        <button
          @click="$router.push('/admin')"
          class="px-4 py-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          Cancel
        </button>
        <button
          @click="save"
          :disabled="loading"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {{ loading ? 'Saving...' : 'Save Post' }}
        </button>
      </div>
    </div>

    <div class="grid gap-6">
      <div class="grid gap-2">
        <label class="font-medium">Title</label>
        <input
          v-model="form.title"
          type="text"
          class="w-full px-4 py-2 border rounded-lg bg-transparent dark:border-zinc-700"
          placeholder="Post Title"
        />
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="grid gap-2">
          <label class="font-medium">Slug</label>
          <input
            v-model="form.slug"
            type="text"
            class="w-full px-4 py-2 border rounded-lg bg-transparent dark:border-zinc-700"
            placeholder="post-url-slug"
          />
        </div>
        <div class="grid gap-2">
          <label class="font-medium">Cover Image URL</label>
          <input
            v-model="form.coverImage"
            type="text"
            class="w-full px-4 py-2 border rounded-lg bg-transparent dark:border-zinc-700"
            placeholder="https://..."
          />
        </div>
      </div>

      <div class="grid gap-2">
        <label class="font-medium">Excerpt</label>
        <textarea
          v-model="form.excerpt"
          rows="3"
          class="w-full px-4 py-2 border rounded-lg bg-transparent dark:border-zinc-700"
          placeholder="Short summary..."
        ></textarea>
      </div>

      <div class="grid gap-2">
        <label class="font-medium">Content</label>
        <RichTextEditor v-model="form.content" :uploader="handleImageUpload" />
      </div>
    </div>
  </div>
</template>
