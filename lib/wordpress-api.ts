export interface WordPressPost {
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

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WordPressTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

const WP_API_BASE = process.env.NEXT_PUBLIC_WP_API_URL || 'https://javedch.com/wp-json/wp/v2';

export class WordPressAPI {
  private baseUrl: string;

  constructor(baseUrl: string = WP_API_BASE) {
    this.baseUrl = baseUrl;
  }

  // Helper function to replace brand names in text content
  private replaceBrandNames(text: string): string {
    if (!text) return text;
    
    return text
      // Replace English variations
      .replace(/JavedCh/gi, 'HasniTube')
      .replace(/Javed Chaudhry/gi, 'Hasni Tube')
      // Replace Urdu variations
      .replace(/جاوید چودھری/g, 'HasniTube')
      .replace(/زیرو پوائنٹ/g, 'HasniTube');
  }

  // Helper function to process WordPress post and replace brand names
  private processPost(post: WordPressPost): WordPressPost {
    const processedPost = { ...post };

    // Process title
    if (processedPost.title?.rendered) {
      processedPost.title.rendered = this.replaceBrandNames(processedPost.title.rendered);
    }

    // Process excerpt
    if (processedPost.excerpt?.rendered) {
      processedPost.excerpt.rendered = this.replaceBrandNames(processedPost.excerpt.rendered);
    }

    // Process content
    if (processedPost.content?.rendered) {
      processedPost.content.rendered = this.replaceBrandNames(processedPost.content.rendered);
    }

    // Process embedded data
    if (processedPost._embedded) {
      // Process author names
      if (processedPost._embedded.author) {
        processedPost._embedded.author = processedPost._embedded.author.map(author => ({
          ...author,
          name: this.replaceBrandNames(author.name)
        }));
      }

      // Process featured media alt text
      if (processedPost._embedded['wp:featuredmedia']) {
        processedPost._embedded['wp:featuredmedia'] = processedPost._embedded['wp:featuredmedia'].map(media => ({
          ...media,
          alt_text: this.replaceBrandNames(media.alt_text || '')
        }));
      }

      // Process terms (categories and tags)
      if (processedPost._embedded['wp:term']) {
        processedPost._embedded['wp:term'] = processedPost._embedded['wp:term'].map(termGroup =>
          termGroup.map(term => ({
            ...term,
            name: this.replaceBrandNames(term.name)
          }))
        );
      }
    }

    return processedPost;
  }

  // Helper function to process category and replace brand names
  private processCategory(category: WordPressCategory): WordPressCategory {
    return {
      ...category,
      name: this.replaceBrandNames(category.name),
      description: this.replaceBrandNames(category.description)
    };
  }

  // Helper function to process tag and replace brand names
  private processTag(tag: WordPressTag): WordPressTag {
    return {
      ...tag,
      name: this.replaceBrandNames(tag.name),
      description: this.replaceBrandNames(tag.description)
    };
  }

  async fetchPosts(params: {
    page?: number;
    per_page?: number;
    categories?: string;
    tags?: string;
    search?: string;
    orderby?: string;
    order?: 'asc' | 'desc';
  } = {}): Promise<{ posts: WordPressPost[]; totalPages: number; total: number }> {
    const searchParams = new URLSearchParams({
      _embed: 'true',
      per_page: (params.per_page || 10).toString(),
      page: (params.page || 1).toString(),
      orderby: params.orderby || 'date',
      order: params.order || 'desc',
      ...Object.fromEntries(
        Object.entries(params).filter(([key, value]) => 
          value !== undefined && !['page', 'per_page', 'orderby', 'order'].includes(key)
        )
      )
    });

    try {
      const response = await fetch(`${this.baseUrl}/posts?${searchParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const posts = await response.json();
      const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
      const total = parseInt(response.headers.get('X-WP-Total') || '0');
      
      // Process each post to replace brand names
      const processedPosts = posts.map((post: WordPressPost) => this.processPost(post));
      
      return { posts: processedPosts, totalPages, total };
    } catch (error) {
      console.error('Error fetching posts:', error);
      return { posts: [], totalPages: 1, total: 0 };
    }
  }

  async fetchPostBySlug(slug: string): Promise<WordPressPost | null> {
    try {
      const response = await fetch(`${this.baseUrl}/posts?slug=${slug}&_embed=true`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const posts = await response.json();
      if (posts.length === 0) return null;
      
      // Process the post to replace brand names
      return this.processPost(posts[0]);
    } catch (error) {
      console.error('Error fetching post:', error);
      return null;
    }
  }

  async fetchCategories(): Promise<WordPressCategory[]> {
    try {
      const response = await fetch(`${this.baseUrl}/categories?per_page=100`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const categories = await response.json();
      
      // Process each category to replace brand names
      return categories.map((category: WordPressCategory) => this.processCategory(category));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async fetchTags(): Promise<WordPressTag[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tags?per_page=100`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const tags = await response.json();
      
      // Process each tag to replace brand names
      return tags.map((tag: WordPressTag) => this.processTag(tag));
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  }

  async fetchCategoryBySlug(slug: string): Promise<WordPressCategory | null> {
    try {
      const response = await fetch(`${this.baseUrl}/categories?slug=${slug}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const categories = await response.json();
      if (categories.length === 0) return null;
      
      // Process the category to replace brand names
      return this.processCategory(categories[0]);
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  }

  async fetchTagBySlug(slug: string): Promise<WordPressTag | null> {
    try {
      const response = await fetch(`${this.baseUrl}/tags?slug=${slug}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const tags = await response.json();
      if (tags.length === 0) return null;
      
      // Process the tag to replace brand names
      return this.processTag(tags[0]);
    } catch (error) {
      console.error('Error fetching tag:', error);
      return null;
    }
  }
}

export const wpApi = new WordPressAPI();