'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';
import { WordPressPostCard } from '@/components/posts/wordpress-post-card';
import { SidebarAd } from '@/components/ads/google-adsense';
import { PaginationWithPerPage } from '@/components/ui/pagination-with-perpage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Filter, Grid, List, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { WordPressPost, WordPressCategory } from '@/lib/wordpress-api';

interface CategoryPageProps {
  category: WordPressCategory;
  posts: WordPressPost[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

export function CategoryPage({ category, posts, currentPage, totalPages, totalPosts }: CategoryPageProps) {
  const { t, isRTL } = useLanguage();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [perPage, setPerPage] = useState(12);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/50 bg-muted/20">
        <div className="container mx-auto px-4 py-12">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/">
              <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180 ms-2' : 'me-2'}`} />
              Back to Home
            </Link>
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-xs font-medium">
                {t('categories')}
              </Badge>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{totalPosts} articles</span>
            </div>
            
            <div className="space-y-4">
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight ${isRTL ? 'font-arabic' : ''}`}>
                {category.name}
              </h1>
              
              {category.description && (
                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                  {category.description}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Updated daily</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Trending topics</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Filters and Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 bg-muted/30 rounded-lg border"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span className="text-sm font-medium">View:</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * perPage) + 1}-{Math.min(currentPage * perPage, totalPosts)} of {totalPosts} articles
              </div>
            </motion.div>

            {/* Posts Grid/List */}
            {posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center py-16"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No articles found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    There are no articles in this category yet. Check back later for updates.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-8'
                    : 'space-y-8'
                }
              >
                {posts.map((post, index) => (
                  <WordPressPostCard
                    key={post.id}
                    post={post}
                    index={index}
                    layout={viewMode}
                  />
                ))}
              </motion.div>
            )}

            {/* Enhanced Pagination with Per-Page */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-8"
              >
                <PaginationWithPerPage
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalPosts}
                  perPage={perPage}
                  onPerPageChange={setPerPage}
                  baseUrl={`/categories/${category.slug}`}
                />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <SidebarAd />
            
            {/* Category Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="p-6 bg-muted/30 rounded-lg border space-y-4"
            >
              <h3 className="font-semibold text-lg">Category Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Articles</span>
                  <span className="font-medium">{totalPosts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <span className="font-medium">8</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}