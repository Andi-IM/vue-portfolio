import { defineBoot } from '#q-app/wrappers';
import { BlogService } from '../services/BlogService';
import { MockBlogService } from '../services/MockBlogService';
import { BLOG_SERVICE_KEY } from '../composables/useBlogService';

declare global {
  interface Window {
    USE_MOCK_SERVICES?: boolean;
  }
}

export default defineBoot(({ app }) => {
  const blogService = window.USE_MOCK_SERVICES ? new MockBlogService() : new BlogService();
  app.provide(BLOG_SERVICE_KEY, blogService);
});
