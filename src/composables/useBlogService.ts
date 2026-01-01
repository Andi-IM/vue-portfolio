import { inject, type InjectionKey } from 'vue'
import type { IBlogService } from '../types/blog'

export const BLOG_SERVICE_KEY: InjectionKey<IBlogService> = Symbol('BlogService')

export function useBlogService() {
  const service = inject(BLOG_SERVICE_KEY)
  if (!service) {
    throw new Error('BlogService not provided! Ensure it is registered in main.ts')
  }
  return service
}
