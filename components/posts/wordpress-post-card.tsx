'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/components/providers/language-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Calendar, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { ApiPost } from '@/lib/api-client';

interface WordPressPostCardProps {
  post: ApiPost;
  index?: number;
  layout?: 'grid' | 'list' | 'horizontal' | 'compact' | 'featured';
  featured?: boolean;
}

export function WordPressPostCard({ 
  post, 
  index = 0, 
  layout = 'grid',
  featured = false 
}: WordPressPostCardProps) {
  const { t, isRTL } = useLanguage();

  const author = post._embedded?.author?.[0];
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const tags = post._embedded?.['wp:term']?.[1] || [];

  const readingTime = Math.ceil(post.content.rendered.replace(/<[^>]*>/g, '').split(' ').length / 200);

  // Compact layout for sidebar
  if (layout === 'compact') {
    return (
      <Link href={`/${post.slug}`} className="flex space-x-4">
        <div className="flex-shrink-0">
          {featuredImage ? (
            <Image
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || post.title.rendered}
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          {categories.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {categories[0].name}
            </Badge>
          )}
          <h4 className="font-semibold leading-tight line-clamp-3 group-hover:text-primary transition-colors">
            {post.title.rendered}
          </h4>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
    );
  }

  // Featured layout for main story
  if (layout === 'featured') {
    return (
      <div className="group cursor-pointer">
        <Link href={`/${post.slug}`}>
          <div className="relative overflow-hidden rounded-lg mb-6">
            {featuredImage ? (
              <Image
                src={featuredImage.source_url}
                alt={featuredImage.alt_text || post.title.rendered}
                width={800}
                height={400}
                className="w-full h-64 md:h-80 lg:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-64 md:h-80 lg:h-96 bg-muted flex items-center justify-center">
                <Calendar className="h-16 w-16 text-muted-foreground" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              {categories.length > 0 && (
                <Badge className="mb-3 bg-primary/90 hover:bg-primary">
                  {categories[0].name}
                </Badge>
              )}
              <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-2">
                {post.title.rendered}
              </h3>
              <div 
                className="text-white/90 text-sm line-clamp-2"
                dangerouslySetInnerHTML={{ 
                  __html: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
                }}
              />
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Horizontal layout for trending
  if (layout === 'horizontal') {
    return (
      <Link href={`/${post.slug}`} className="flex space-x-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
        <div className="flex-shrink-0">
          {featuredImage ? (
            <Image
              src={featuredImage.source_url}
              alt={featuredImage.alt_text || post.title.rendered}
              width={96}
              height={96}
              className="w-24 h-24 object-cover rounded-md group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-24 h-24 bg-muted rounded-md flex items-center justify-center">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          {categories.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {categories[0].name}
            </Badge>
          )}
          <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
            {post.title.rendered}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {author && <span>{author.name}</span>}
            <span>•</span>
            <span>{readingTime} {t('readingTime')}</span>
          </div>
        </div>
      </Link>
    );
  }

  // List layout
  if (layout === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -2 }}
        className="group"
      >
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50">
          <div className="flex flex-col md:flex-row">
            {featuredImage && (
              <div className="md:w-80 flex-shrink-0 relative overflow-hidden">
                <Link href={`/${post.slug}`}>
                  <Image
                    src={featuredImage.source_url}
                    alt={featuredImage.alt_text || post.title.rendered}
                    width={320}
                    height={200}
                    className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                {categories.length > 0 && (
                  <div className="absolute top-4 start-4">
                    <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground">
                      {categories[0].name}
                    </Badge>
                  </div>
                )}
              </div>
            )}
            
            <CardContent className="flex-1 p-6 space-y-4">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                {author && (
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span>{author.name}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <Link href={`/${post.slug}`}>
                <h3 className={`text-xl font-bold leading-tight hover:text-primary transition-colors line-clamp-2 ${isRTL ? 'font-arabic' : ''}`}>
                  {post.title.rendered}
                </h3>
              </Link>
              
              <div 
                className={`text-muted-foreground line-clamp-3 text-sm leading-relaxed ${isRTL ? 'font-arabic' : ''}`}
                dangerouslySetInnerHTML={{ 
                  __html: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 200) + '...'
                }}
              />
              
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{readingTime} {t('readingTime')}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Eye className="h-3 w-3" />
                  <span>1.2k views</span>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Default grid layout
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50">
        {featuredImage && (
          <div className="relative overflow-hidden">
            <Link href={`/${post.slug}`}>
              <Image
                src={featuredImage.source_url}
                alt={featuredImage.alt_text || post.title.rendered}
                width={featured ? 800 : 400}
                height={featured ? 400 : 250}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
            {categories.length > 0 && (
              <div className="absolute top-4 start-4">
                <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground">
                  {categories[0].name}
                </Badge>
              </div>
            )}
          </div>
        )}
        
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            {author && (
              <div className="flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>{author.name}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
          </div>
          
          <Link href={`/${post.slug}`}>
            <h3 className={`font-bold leading-tight hover:text-primary transition-colors line-clamp-2 ${
              featured ? 'text-xl' : 'text-lg'
            } ${isRTL ? 'font-arabic' : ''}`}>
              {post.title.rendered}
            </h3>
          </Link>
          
          <div 
            className={`text-muted-foreground line-clamp-3 text-sm leading-relaxed ${isRTL ? 'font-arabic' : ''}`}
            dangerouslySetInnerHTML={{ 
              __html: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...'
            }}
          />
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{readingTime} {t('readingTime')}</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" />
              <span>1.2k views</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}