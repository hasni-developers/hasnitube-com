import { NextResponse } from 'next/server';

async function fetchAllPosts() {
  const baseUrl = 'http://www.hasnitube.com';
  
  try {
    const response = await fetch(`${baseUrl}/api/posts?per_page=100&orderby=date&order=desc`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.success ? data.posts : [];
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
    return [];
  }
}

async function fetchAllCategories() {
  const baseUrl = 'http://www.hasnitube.com';
  
  try {
    const response = await fetch(`${baseUrl}/api/categories`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.success ? data.categories : [];
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
    return [];
  }
}

async function fetchAllTags() {
  const baseUrl = 'http://www.hasnitube.com';
  
  try {
    const response = await fetch(`${baseUrl}/api/tags`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.success ? data.tags : [];
  } catch (error) {
    console.error('Error fetching tags for sitemap:', error);
    return [];
  }
}

export async function GET() {
  const baseUrl = 'http://www.hasnitube.com';
  
  const [posts, categories, tags] = await Promise.all([
    fetchAllPosts(),
    fetchAllCategories(),
    fetchAllTags()
  ]);

  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 0.3
    },
    {
      url: `${baseUrl}/rss`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8
    }
  ];

  const postUrls = posts.map((post: any) => ({
    url: `${baseUrl}/${post.slug}`,
    lastModified: new Date(post.modified).toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  const categoryUrls = categories.map((category: any) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: 0.7
  }));

  const tagUrls = tags.map((tag: any) => ({
    url: `${baseUrl}/tags/${tag.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.6
  }));

  const allUrls = [...staticPages, ...postUrls, ...categoryUrls, ...tagUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      (url) => `
  <url>
    <loc>${url.url}</loc>
    <lastmod>${url.lastModified}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}