import { ref, onMounted, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import type { Descendant } from 'slate'
import type { BlogPost, IBlogService } from '../types/blog'

export interface PostEditorDependencies {
  blogService: IBlogService
  route: RouteLocationNormalizedLoaded
  router: Router
}

export function usePostEditor({ blogService, route, router }: PostEditorDependencies) {
  const isNew: ComputedRef<boolean> = computed(() => route.params.id === 'new')

  const form: Ref<BlogPost> = ref<BlogPost>({
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
    ] as unknown as Descendant[],
  })

  const loading = ref(false)

  onMounted(async () => {
    if (!isNew.value) {
      try {
        const post = await blogService.getPost(route.params.id as string)
        form.value = post
      } catch (e) {
        console.error('Failed to load post', e)
      }
    }
  })

  const save = async () => {
    if (!form.value.title) {
       alert('Title is required')
       return
    }

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
      console.error('Save error', e)
      alert('Error saving')
    } finally {
      loading.value = false
    }
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    return await blogService.uploadImage(file)
  }

  return {
    form,
    loading,
    isNew,
    save,
    handleImageUpload,
  }
}
