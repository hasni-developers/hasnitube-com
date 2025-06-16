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
    .replace(/زیرو پوائنٹ/g, 'HasniTube');
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

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  try {
    const response = await fetch(`${WP_API_BASE}/posts?slug=${slug}&_embed=true`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const posts = await response.json();
    
    if (posts.length === 0) {
      return NextResponse.json({ 
        post: null,
        success: false,
        error: 'Post not found'
      }, { status: 404 });
    }
    
    // Process the post to replace brand names
    const processedPost = processPost(posts[0]);
    
    return NextResponse.json({ 
      post: processedPost,
      success: true 
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ 
      post: null,
      success: false,
      error: 'Failed to fetch post'
    }, { status: 500 });
  }
}