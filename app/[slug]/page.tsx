import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { SinglePostPage } from '@/components/posts/single-post-page';

interface PostPageProps {
  params: {
    slug: string;
  };
}

async function fetchPostBySlug(slug: string) {
  const baseUrl =  'http://www.hasnitube.com';
  
  try {
    const response = await fetch(`${baseUrl}/api/posts/${slug}`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.success ? data.post : null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  const author = post._embedded?.author?.[0];
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];

  return {
    title: post.title.rendered,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
    authors: author ? [{ name: author.name }] : undefined,
    openGraph: {
      title: post.title.rendered,
      description: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: author ? [author.name] : undefined,
      images: featuredImage ? [
        {
          url: featuredImage.source_url,
          width: 1200,
          height: 630,
          alt: featuredImage.alt_text || post.title.rendered,
        },
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title.rendered,
      description: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160),
      images: featuredImage ? [featuredImage.source_url] : undefined,
    },
  };
}

export default async function Page({ params }: PostPageProps) {
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return <SinglePostPage post={post} />;
}