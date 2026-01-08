import type { IBlogService, BlogPost, BlogPostIndex } from '../types/blog';

export class MockBlogService implements IBlogService {
  private posts: BlogPost[] = [];
  private readonly STORAGE_KEY = 'mock_blog_posts';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = sessionStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.posts = JSON.parse(stored);
      } else {
        // Default initial data
        this.posts = [
          {
            id: 'wordpress-to-quasar',
            title: 'Migrating from WordPress to Quasar',
            slug: 'wordpress-to-quasar',
            excerpt:
              'Why I decided to move my portfolio from a heavy CMS to a modern Vue.js framework, and what I learned along the way.',
            content: `
              <h2>Background</h2>
              <p>For years, I relied on WordPress for my personal portfolio. It was the de facto standard—easy to set up, packed with plugins, and widely supported. However, as my skills as a developer grew, I started to feel the limitations of a monolithic CMS.</p>
              <p>I wanted something faster, more flexible, and fully under my control. I wanted a platform that showcased my ability to build modern web applications, not just install themes. That's when I decided to make the switch to <strong>Vue.js</strong> and the <strong>Quasar Framework</strong>.</p>

              <h2>WordPress Issues</h2>
              <p>Don't get me wrong, WordPress is a powerful tool. But for a developer portfolio, it felt like using a sledgehammer to crack a nut.</p>
              <p>First, there was the <strong>bloat</strong>. Even with a minimal theme, I was loading scripts and styles I didn't need. Performance scores were mediocre unless I spent hours optimizing caching and asset minification.</p>
              <p>Second, the <strong>security</strong> aspect. WordPress sites are constant targets for bots. I spent more time updating plugins and worrying about vulnerabilities than I did writing content or building features.</p>

              <h2>Reasons to Choose Quasar</h2>
              <p>I chose <strong>Quasar Framework</strong> because it offers a "batteries-included" approach to Vue.js development. It provides a robust set of Material Design components, a powerful CLI, and excellent support for multiple build modes (SPA, SSR, PWA, Electron).</p>
              <blockquote>
                "Quasar allows you to write code once and deploy it as a website, a mobile app, or even a desktop application. It's the ultimate productivity booster for Vue developers."
              </blockquote>
              <p>This versatility meant I could build my portfolio as a high-performance Single Page Application (SPA) today, and easily convert it to a PWA or SSR app in the future without rewriting my core logic.</p>

              <h2>Benefits</h2>
              <h3>Performance & Experience</h3>
              <p>The difference was night and day. My new site loads instantly. The navigation is buttery smooth because it doesn't require a full page reload for every click. This is the <strong>Single Page Application</strong> experience I wanted.</p>

              <h3>Development Joy</h3>
              <p>Working with Vue's component-based architecture is a joy. I can encapsulate logic and styles, making the codebase clean and maintainable. No more digging through spaghetti PHP files or fighting with theme overrides.</p>

              <h3>Key Advantages</h3>
              <ul>
                <li><strong>Speed:</strong> Near-instant route changes and load times.</li>
                <li><strong>Control:</strong> Full sovereignty over the frontend code and structure.</li>
                <li><strong>Security:</strong> No backend database to hack (using static generation or secure APIs).</li>
                <li><strong>Scalability:</strong> rigorous type safety with TypeScript.</li>
              </ul>

              <h2>Conclusion</h2>
              <p>Migrating to Quasar was more than just a tech swap; it was a shift in mindset. It allowed me to treat my portfolio as a software project rather than a collection of pages.</p>
              <p>If you're a developer feeling constrained by traditional CMS platforms, I highly recommend giving Quasar a try. The learning curve is worth the freedom you gain.</p>
            `,
            coverImage:
              'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=1000',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Another Post (Legacy)',
            slug: 'mock-post-2',
            excerpt: 'Another mock post to show list variety.',
            content: '<p>This is just a placeholder to show multiple posts exist.</p>',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        this.persist();
      }
    } catch (e) {
      console.warn('Failed to access sessionStorage', e);
    }
  }

  private persist() {
    try {
      sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.posts));
    } catch (e) {
      console.warn('Failed to save to sessionStorage', e);
    }
  }

  async getPosts(): Promise<BlogPostIndex[]> {
    await Promise.resolve();
    // oxlint-disable-next-line no-unused-vars
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return this.posts.map(({ content, ...index }) => index as BlogPostIndex);
  }

  async getPost(id: string): Promise<BlogPost> {
    await Promise.resolve();
    const post = this.posts.find((p) => p.id === id);
    if (!post) throw new Error('Post not found');
    return post;
  }

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    await Promise.resolve();
    const post = this.posts.find((p) => p.slug === slug || p.id === slug);
    return post || null;
  }

  async savePost(post: Partial<BlogPost>): Promise<BlogPost> {
    await Promise.resolve();
    const newPost = {
      id: post.id || Math.random().toString(36).substr(2, 9),
      title: post.title || 'Untitled',
      slug: post.slug || 'untitled',
      excerpt: post.excerpt || '',
      content: post.content || '',
      createdAt: post.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...post,
    } as BlogPost;

    const existingIndex = this.posts.findIndex((p) => p.id === newPost.id);
    if (existingIndex >= 0) {
      this.posts[existingIndex] = newPost;
    } else {
      this.posts.push(newPost);
    }

    this.persist();
    return newPost;
  }

  async deletePost(id: string): Promise<void> {
    await Promise.resolve();
    this.posts = this.posts.filter((p) => p.id !== id);
    this.persist();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async uploadImage(_file: File): Promise<string> {
    await Promise.resolve();
    return 'https://example.com/mock-image.png';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async incrementView(_id: string): Promise<void> {
    await Promise.resolve();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getPostViews(_id: string): Promise<number> {
    await Promise.resolve();
    return 100; // Mock view count
  }

  async getAllViews(): Promise<Record<string, number>> {
    await Promise.resolve();
    return {
      '1': 150,
      '2': 50,
    };
  }
}
