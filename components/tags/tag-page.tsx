'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';
import { WordPressPostCard } from '@/components/posts/wordpress-post-card';
import { SidebarAd } from '@/components/ads/google-adsense';
import { PaginationWithPerPage } from '@/components/ui/pagination-with-perpage';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Tag, Hash, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { WordPressPost, WordPressTag } from '@/lib/wordpress-api';

interface TagPageProps {
  tag: WordPressTag;
  posts: WordPressPost[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}

export function TagPage({ tag, posts, currentPage, totalPages, totalPosts }: TagPageProps) {
  const { t, isRTL } = useLanguage();
  const [perPage, setPerPage] = useState(100);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 to-blue-500/5">
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
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Hash className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="outline" className="text-xs font-medium">
                Tag
              </Badge>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{totalPosts} articles</span>
            </div>
            
            <div className="space-y-4">
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight ${isRTL ? 'font-arabic' : ''}`}>
                #{tag.name}
              </h1>
              
              {tag.description && (
                <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
                  {tag.description}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4" />
                <span>Tagged articles</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Related content</span>
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
            {/* Posts Grid */}
            {posts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center py-16"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                    <Tag className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No articles found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    There are no articles with this tag yet. Check back later for updates.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {posts.map((post, index) => (
                  <WordPressPostCard
                    key={post.id}
                    post={post}
                    index={index}
                    layout="grid"
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
                  baseUrl={`/tags/${tag.slug}`}
                />
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <SidebarAd />
            
            {/* Tag Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="p-6 bg-muted/30 rounded-lg border space-y-4"
            >
              <h3 className="font-semibold text-lg">Tag Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Articles</span>
                  <span className="font-medium">{totalPosts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tag Popularity</span>
                  <Badge variant="secondary">High</Badge>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}