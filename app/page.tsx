'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { WordPressPostCard } from '@/components/posts/wordpress-post-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, Clock, ArrowRight, Calendar, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { apiClient, ApiPost } from '@/lib/api-client';

export default function HomePage() {
  const { t, isRTL } = useLanguage();
  const [posts, setPosts] = useState<ApiPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<ApiPost[]>([]);
  const [latestPosts, setLatestPosts] = useState<ApiPost[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<ApiPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch latest posts
        const latestResponse = await apiClient.fetchPosts({
          per_page: 12,
          orderby: 'date',
          order: 'desc'
        });

        if (latestResponse.success && latestResponse.posts.length > 0) {
          const allPosts = latestResponse.posts;
          setPosts(allPosts);
          
          // Set featured post (first post)
          setFeaturedPosts([allPosts[0]]);
          
          // Set latest posts (first 6)
          setLatestPosts(allPosts.slice(0, 6));
          
          // Set trending posts (posts 6-10 or random selection)
          setTrendingPosts(allPosts.slice(6, 10));
        } else {
          setError(latestResponse.error || 'Failed to fetch posts');
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setError('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading latest news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            <TrendingUp className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold">Unable to load content</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {error}. Please check your internet connection and try again.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const mainFeatured = featuredPosts[0];
  const sideArticles = latestPosts.slice(1, 4);
  const gridArticles = latestPosts.slice(4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight ${
              isRTL ? 'font-arabic' : ''
            }`}>
              {t('heroTitle')}
            </h1>
            <p className={`text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed ${
              isRTL ? 'font-arabic' : ''
            }`}>
              {t('heroSubtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 space-y-16">
        {/* Featured Section */}
        {mainFeatured && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="flex items-center space-x-2">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h2 className="text-2xl font-bold tracking-tight">Featured Story</h2>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Featured Article */}
              <div className="lg:col-span-2">
                <WordPressPostCard 
                  post={mainFeatured} 
                  featured={true}
                  layout="featured"
                />
              </div>
              
              {/* Side Articles */}
              <div className="space-y-6">
                {sideArticles.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="group"
                  >
                    <WordPressPostCard 
                      post={post} 
                      layout="compact"
                      index={index}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        <Separator />

        {/* Latest News Grid */}
        {gridArticles.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-6 bg-primary rounded-full"></div>
                <h2 className="text-2xl font-bold tracking-tight">{t('latestNews')}</h2>
              </div>
              <Button variant="outline" asChild>
                <Link href="/categories">
                  View All
                  <ArrowRight className={`h-4 w-4 ${isRTL ? 'rotate-180 mr-2' : 'ml-2'}`} />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gridArticles.map((post, index) => (
                <WordPressPostCard 
                  key={post.id} 
                  post={post} 
                  index={index}
                  layout="grid"
                />
              ))}
            </div>
          </section>
        )}

        <Separator />

        {/* Trending Section */}
        {trendingPosts.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-6 bg-primary rounded-full"></div>
              <h2 className="text-2xl font-bold tracking-tight">{t('trendingNews')}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trendingPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <WordPressPostCard 
                    post={post} 
                    layout="horizontal"
                    index={index}
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}