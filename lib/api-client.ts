// Client-side API functions to interact with our custom API routes

export interface ApiPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  author: number;
  date: string;
  modified: string;
  categories: number[];
  tags: number[];
  featured_media: number;
  _embedded?: {
    author: Array<{
      id: number;
      name: string;
      avatar_urls: {
        [key: string]: string;
      };
    }>;
    'wp:featuredmedia': Array<{
      id: number;
      source_url: string;
      alt_text: string;
    }>;
    'wp:term': Array<Array<{
      id: number;
      name: string;
      slug: string;
      taxonomy: string;
    }>>;
  };
}

export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface ApiTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface PostsResponse {
  posts: ApiPost[];
  totalPages: number;
  total: number;
  success: boolean;
  error?: string;
}

export interface PostResponse {
  post: ApiPost | null;
  success: boolean;
  error?: string;
}

export interface CategoriesResponse {
  categories: ApiCategory[];
  success: boolean;
  error?: string;
}

export interface CategoryResponse {
  category: ApiCategory | null;
  success: boolean;
  error?: string;
}

export interface TagsResponse {
  tags: ApiTag[];
  success: boolean;
  error?: string;
}

export interface TagResponse {
  tag: ApiTag | null;
  success: boolean;
  error?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }

  async fetchPosts(params: {
    page?: number;
    per_page?: number;
    categories?: string;
    tags?: string;
    search?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
  } = {}): Promise<PostsResponse> {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(`${this.baseUrl}/api/posts?${searchParams}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return {
        posts: [],
        totalPages: 1,
        total: 0,
        success: false,
        error: 'Failed to fetch posts'
      };
    }
  }

  async fetchPostBySlug(slug: string): Promise<PostResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/posts/${slug}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching post:', error);
      return {
        post: null,
        success: false,
        error: 'Failed to fetch post'
      };
    }
  }

  async fetchCategories(): Promise<CategoriesResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/categories`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return {
        categories: [],
        success: false,
        error: 'Failed to fetch categories'
      };
    }
  }

  async fetchCategoryBySlug(slug: string): Promise<CategoryResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/categories/${slug}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching category:', error);
      return {
        category: null,
        success: false,
        error: 'Failed to fetch category'
      };
    }
  }

  async fetchTags(): Promise<TagsResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tags:', error);
      return {
        tags: [],
        success: false,
        error: 'Failed to fetch tags'
      };
    }
  }

  async fetchTagBySlug(slug: string): Promise<TagResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags/${slug}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching tag:', error);
      return {
        tag: null,
        success: false,
        error: 'Failed to fetch tag'
      };
    }
  }
}

export const apiClient = new ApiClient();