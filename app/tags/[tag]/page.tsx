import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { TagPage } from '@/components/tags/tag-page';

interface TagPageProps {
  params: {
    tag: string;
  };
  searchParams: {
    page?: string;
  };
}

async function fetchTagBySlug(slug: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/tags/${slug}`, {
      next: { revalidate: 600 }, // Cache for 10 minutes
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.success ? data.tag : null;
  } catch (error) {
    console.error('Error fetching tag:', error);
    return null;
  }
}

async function fetchPostsByTag(tagId: number, page: number = 1) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/posts?tags=${tagId}&page=${page}&per_page=12`, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) {
      return { posts: [], totalPages: 1, total: 0 };
    }
    
    const data = await response.json();
    return data.success ? { posts: data.posts, totalPages: data.totalPages, total: data.total } : { posts: [], totalPages: 1, total: 0 };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { posts: [], totalPages: 1, total: 0 };
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = await fetchTagBySlug(params.tag);
  
  if (!tag) {
    return {
      title: 'Tag Not Found',
    };
  }

  return {
    title: `${tag.name} - HasniTube`,
    description: tag.description || `Articles tagged with ${tag.name}. Explore related content and stay updated.`,
    keywords: `${tag.name}, news, articles, HasniTube`,
    openGraph: {
      title: `${tag.name} Articles`,
      description: tag.description || `Articles tagged with ${tag.name} from around the world.`,
      type: 'website',
    },
  };
}

export default async function Page({ params, searchParams }: TagPageProps) {
  const tag = await fetchTagBySlug(params.tag);
  
  if (!tag) {
    notFound();
  }

  const currentPage = parseInt(searchParams.page || '1');
  const { posts, totalPages, total } = await fetchPostsByTag(tag.id, currentPage);

  return (
    <TagPage 
      tag={tag} 
      posts={posts} 
      currentPage={currentPage}
      totalPages={totalPages}
      totalPosts={total}
    />
  );
}