import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { CategoryPage } from '@/components/categories/category-page';

interface CategoryPageProps {
  params: {
    category: string;
  };
  searchParams: {
    page?: string;
  };
}

async function fetchCategoryBySlug(slug: string) {
  const baseUrl =  'http://www.hasnitube.com';
  
  try {
    const response = await fetch(`${baseUrl}/api/categories/${slug}`, {
      next: { revalidate: 600 }, // Cache for 10 minutes
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.success ? data.category : null;
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

async function fetchPostsByCategory(categoryId: number, page: number = 1) {
  const baseUrl =  'http://www.hasnitube.com';
  
  try {
    const response = await fetch(`${baseUrl}/api/posts?categories=${categoryId}&page=${page}&per_page=12`, {
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

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await fetchCategoryBySlug(params.category);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} News - HasniTube`,
    description: category.description || `Latest ${category.name} news and updates. Stay informed with comprehensive coverage.`,
    keywords: `${category.name}, news, updates, HasniTube`,
    openGraph: {
      title: `${category.name} News`,
      description: category.description || `Latest ${category.name} news and updates from around the world.`,
      type: 'website',
    },
  };
}

export default async function Page({ params, searchParams }: CategoryPageProps) {
  const category = await fetchCategoryBySlug(params.category);
  
  if (!category) {
    notFound();
  }

  const currentPage = parseInt(searchParams.page || '1');
  const { posts, totalPages, total } = await fetchPostsByCategory(category.id, currentPage);

  return (
    <CategoryPage 
      category={category} 
      posts={posts} 
      currentPage={currentPage}
      totalPages={totalPages}
      totalPosts={total}
    />
  );
}