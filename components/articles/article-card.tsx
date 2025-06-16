'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/components/providers/language-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Article } from '@/lib/types';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
  index?: number;
}

export function ArticleCard({ article, featured = false, index = 0 }: ArticleCardProps) {
  const { t, isRTL } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden group hover:shadow-lg transition-all duration-300 border-border/50">
        <div className="relative overflow-hidden">
          <Link href={`/${article.slug}`}>
            <Image
              src={article.image}
              alt={article.title}
              width={featured ? 800 : 400}
              height={featured ? 400 : 250}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
          <div className="absolute top-4 left-4">
            <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground">
              {t(article.category.toLowerCase())}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
            </div>
          </div>
          
          <Link href={`/${article.slug}`}>
            <h3 className={`font-bold leading-tight hover:text-primary transition-colors line-clamp-2 ${
              featured ? 'text-xl' : 'text-lg'
            } ${isRTL ? 'font-arabic' : ''}`}>
              {article.title}
            </h3>
          </Link>
          
          <p className={`text-muted-foreground line-clamp-3 text-sm leading-relaxed ${isRTL ? 'font-arabic' : ''}`}>
            {article.excerpt}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{article.readingTime} {t('readingTime')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}