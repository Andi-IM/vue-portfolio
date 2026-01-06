export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPostIndex {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBlogService {
  getPosts(): Promise<BlogPostIndex[]>;
  getPost(id: string): Promise<BlogPost>;
  getPostBySlug(slug: string): Promise<BlogPost | null>;
  savePost(post: Partial<BlogPost>): Promise<BlogPost>;
  deletePost(id: string): Promise<void>;
  uploadImage(file: File): Promise<string>;
  incrementView(id: string): Promise<void>;
  getPostViews(id: string): Promise<number>;
  getAllViews(): Promise<Record<string, number>>;
}
