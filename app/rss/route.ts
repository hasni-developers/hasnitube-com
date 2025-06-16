import { NextResponse } from 'next/server';

async function fetchLatestPosts() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/posts?per_page=20&orderby=date&order=desc`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.success ? data.posts : [];
  } catch (error) {
    console.error('Error fetching posts for RSS:', error);
    return [];
  }
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';
  const posts = await fetchLatestPosts();
  
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>HasniTube</title>
    <description>Your trusted source for breaking news, in-depth analysis, and comprehensive coverage from around the world.</description>
    <link>${baseUrl}</link>
    <language>en-us</language>
    <atom:link href="${baseUrl}/rss" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    ${posts
      .map(
        (post: any) => `
    <item>
      <title><![CDATA[${post.title.rendered}]]></title>
      <description><![CDATA[${post.excerpt.rendered.replace(/<[^>]*>/g, '')}]]></description>
      <link>${baseUrl}/${post.slug}</link>
      <guid>${baseUrl}/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${post._embedded?.author?.[0]?.name || 'HasniTube Team'}</author>
      <category>${post._embedded?.['wp:term']?.[0]?.[0]?.name || 'News'}</category>
      ${post._embedded?.['wp:featuredmedia']?.[0]?.source_url ? `<enclosure url="${post._embedded['wp:featuredmedia'][0].source_url}" type="image/jpeg"/>` : ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}