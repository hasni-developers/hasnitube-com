import { NextRequest, NextResponse } from 'next/server';

const WP_API_BASE = process.env.NEXT_PUBLIC_WP_API_URL || 'https://javedch.com/wp-json/wp/v2';

// Helper function to replace brand names in text content
function replaceBrandNames(text: string): string {
  if (!text) return text;
  
  return text
    // Replace English variations
    .replace(/JavedCh/gi, 'HasniTube')
    .replace(/Javed Chaudhry/gi, 'Hasni Tube')
    // Replace Urdu variations
    .replace(/جاوید چودھری/g, 'HasniTube')
    .replace(/زیرو پوائنٹ/g, 'HasniTube')
    .replace(/مانیٹرنگ ڈیسک/g, 'ٹیم حسنی');
}

// Helper function to process WordPress post and replace brand names
function processPost(post: any): any {
  const processedPost = { ...post };

  // Process title
  if (processedPost.title?.rendered) {
    processedPost.title.rendered = replaceBrandNames(processedPost.title.rendered);
  }

  // Process excerpt
  if (processedPost.excerpt?.rendered) {
    processedPost.excerpt.rendered = replaceBrandNames(processedPost.excerpt.rendered);
  }

  // Process content
  if (processedPost.content?.rendered) {
    processedPost.content.rendered = replaceBrandNames(processedPost.content.rendered);
  }

  // Process embedded data
  if (processedPost._embedded) {
    // Process author names
    if (processedPost._embedded.author) {
      processedPost._embedded.author = processedPost._embedded.author.map((author: any) => ({
        ...author,
        name: replaceBrandNames(author.name)
      }));
    }

    // Process featured media alt text
    if (processedPost._embedded['wp:featuredmedia']) {
      processedPost._embedded['wp:featuredmedia'] = processedPost._embedded['wp:featuredmedia'].map((media: any) => ({
        ...media,
        alt_text: replaceBrandNames(media.alt_text || '')
      }));
    }

    // Process terms (categories and tags)
    if (processedPost._embedded['wp:term']) {
      processedPost._embedded['wp:term'] = processedPost._embedded['wp:term'].map((termGroup: any) =>
        termGroup.map((term: any) => ({
          ...term,
          name: replaceBrandNames(term.name)
        }))
      );
    }
  }

  return processedPost;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  const params = {
    _embed: 'true',
    per_page: searchParams.get('per_page') || '10',
    page: searchParams.get('page') || '1',
    orderby: searchParams.get('orderby') || 'date',
    order: searchParams.get('order') || 'desc',
    categories: searchParams.get('categories') || '',
    tags: searchParams.get('tags') || '',
    search: searchParams.get('search') || '',
  };

  // Remove empty parameters
  const filteredParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== '')
  );

  const queryString = new URLSearchParams(filteredParams).toString();

  try {
    const response = await fetch(`${WP_API_BASE}/posts?${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
    const total = parseInt(response.headers.get('X-WP-Total') || '0');
    
    // Process each post to replace brand names
    const processedPosts = posts.map((post: any) => processPost(post));
    
    return NextResponse.json({ 
      posts: processedPosts, 
      totalPages, 
      total,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ 
      posts: [], 
      totalPages: 1, 
      total: 0,
      success: false,
      error: 'Failed to fetch posts'
    }, { status: 500 });
  }
}