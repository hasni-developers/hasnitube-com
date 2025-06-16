'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';
import { InArticleAd, SidebarAd } from '@/components/ads/google-adsense';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  User, 
  Calendar, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin,
  ArrowLeft,
  Eye,
  MessageCircle,
  Bookmark,
  ThumbsUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ApiPost } from '@/lib/api-client';

interface SinglePostPageProps {
  post: ApiPost;
}

export function SinglePostPage({ post }: SinglePostPageProps) {
  const { t, isRTL } = useLanguage();

  const author = post._embedded?.author?.[0];
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0];
  const categories = post._embedded?.['wp:term']?.[0] || [];
  const tags = post._embedded?.['wp:term']?.[1] || [];

  const readingTime = Math.ceil(post.content.rendered.replace(/<[^>]*>/g, '').split(' ').length / 200);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `${post.title.rendered}`;

  const handleShare = (platform: string) => {
    let url = '';
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  // Split content for ad insertion
  const contentParts = post.content.rendered.split('</p>');
  const midPoint = Math.floor(contentParts.length / 2);

  return (
    <div className="min-h-screen">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? 'rotate-180 ms-2' : 'me-2'}`} />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-3 max-w-4xl">
            {/* Article Header */}
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6 mb-12"
            >
              <div className="space-y-4">
                {categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {categories.slice(0, 2).map((category) => (
                      <Badge key={category.id} className="bg-primary/10 text-primary hover:bg-primary/20">
                        <Link href={`/categories/${category.slug}`}>
                          {category.name}
                        </Link>
                      </Badge>
                    ))}
                  </div>
                )}
                
                <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight ${
                  isRTL ? 'font-arabic' : ''
                }`}>
                  {post.title.rendered}
                </h1>
                
                <div 
                  className={`text-xl text-muted-foreground leading-relaxed ${isRTL ? 'font-arabic' : ''}`}
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />
              </div>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground py-6 border-y border-border/50">
                {author && (
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={author.avatar_urls['48']} alt={author.name} />
                      <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-foreground">{author.name}</div>
                      <div className="text-xs">Author</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} {t('readingTime')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>2.4k views</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>12 comments</span>
                </div>
              </div>

              {/* Social Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 me-2" />
                    Like (24)
                  </Button>
                  <Button variant="outline" size="sm">
                    <Bookmark className="h-4 w-4 me-2" />
                    Save
                  </Button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Share:</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('facebook')}
                  >
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('twitter')}
                  >
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare('linkedin')}
                  >
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.header>

            {/* Featured Image */}
            {featuredImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative mb-12 rounded-lg overflow-hidden"
              >
                <Image
                  src={featuredImage.source_url}
                  alt={featuredImage.alt_text || post.title.rendered}
                  width={1200}
                  height={600}
                  className="w-full h-64 md:h-96 object-cover"
                />
                {featuredImage.alt_text && (
                  <div className="absolute bottom-0 start-0 end-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <p className="text-white text-sm">{featuredImage.alt_text}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="prose prose-lg max-w-none mb-12"
            >
              {/* First half of content */}
              <div dangerouslySetInnerHTML={{ 
                __html: contentParts.slice(0, midPoint).join('</p>') + '</p>'
              }} />
              
              {/* In-article ad */}
              <InArticleAd />
              
              {/* Second half of content */}
              <div dangerouslySetInnerHTML={{ 
                __html: contentParts.slice(midPoint).join('</p>')
              }} />
            </motion.div>

            {/* Tags */}
            {tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-2 mb-8"
              >
                <span className="text-sm font-medium text-muted-foreground me-2">Tags:</span>
                {tags.map((tag) => (
                  <Badge key={tag.id} variant="outline" className="text-xs">
                    <Link href={`/tags/${tag.slug}`}>
                      #{tag.name}
                    </Link>
                  </Badge>
                ))}
              </motion.div>
            )}

            {/* Author Bio */}
            {author && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="p-6 bg-muted/30 rounded-lg mb-12"
              >
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={author.avatar_urls['96']} alt={author.name} />
                    <AvatarFallback className="text-lg">{author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">About {author.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      Experienced journalist covering technology, politics, and global affairs. 
                      Passionate about delivering accurate and insightful news to readers worldwide.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm">
                        Follow
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            <SidebarAd />
            
            {/* Related Articles */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="p-6 bg-muted/30 rounded-lg border space-y-4"
            >
              <h3 className="font-semibold text-lg">Related Articles</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex space-x-3">
                    <div className="w-16 h-16 bg-muted rounded-md flex-shrink-0"></div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-sm font-medium line-clamp-2">
                        Related article title goes here
                      </h4>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Newsletter Signup */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="p-6 bg-primary/5 rounded-lg border space-y-4"
            >
              <h3 className="font-semibold text-lg">Stay Updated</h3>
              <p className="text-sm text-muted-foreground">
                Get the latest news delivered to your inbox.
              </p>
              <div className="space-y-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 text-sm border rounded-md"
                />
                <Button className="w-full" size="sm">
                  Subscribe
                </Button>
              </div>
            </motion.div>
          </aside>
        </div>
      </div>
    </div>
  );
}