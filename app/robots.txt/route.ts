import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'http://www.hasnitube.com';
  
  const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Allow all search engines to access RSS feed
Allow: /rss

# Allow access to API endpoints for legitimate crawlers
Allow: /api/

# Disallow admin or sensitive areas (if any exist in the future)
Disallow: /admin/
Disallow: /private/

# Allow access to static assets
Allow: /_next/static/
Allow: /favicon.ico
Allow: /images/
Allow: /icons/

# Host directive
Host: ${baseUrl}`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}