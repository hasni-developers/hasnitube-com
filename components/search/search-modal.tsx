'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/providers/language-provider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { mockArticles } from '@/lib/mock-data';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const { t, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(mockArticles.slice(0, 5));

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = mockArticles.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered.slice(0, 8));
    } else {
      setSearchResults(mockArticles.slice(0, 5));
    }
  }, [searchQuery]);

  const recentSearches = ['Technology news', 'Politics update', 'World events'];
  const trendingTopics = ['AI Revolution', 'Climate Change', 'Space Exploration'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5" />
            <span>{t('search')}</span>
          </DialogTitle>
        </DialogHeader>
        
        <Command className="border-0">
          <CommandInput
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="border-0 border-b rounded-none focus:ring-0"
          />
          
          <CommandList className="max-h-96 overflow-y-auto">
            {!searchQuery && (
              <>
                <CommandGroup heading="Recent Searches">
                  {recentSearches.map((search, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => setSearchQuery(search)}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{search}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
                
                <CommandGroup heading="Trending">
                  {trendingTopics.map((topic, index) => (
                    <CommandItem
                      key={index}
                      onSelect={() => setSearchQuery(topic)}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>{topic}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
            
            {searchQuery && (
              <CommandGroup heading={t('searchResults')}>
                {searchResults.length === 0 ? (
                  <CommandEmpty>{t('noResults')}</CommandEmpty>
                ) : (
                  searchResults.map((article) => (
                    <CommandItem
                      key={article.id}
                      asChild
                      className="cursor-pointer"
                    >
                      <Link
                        href={`/${article.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="flex items-start space-x-3 p-3 hover:bg-accent rounded-md"
                      >
                        <div className="flex-1 space-y-1">
                          <h4 className="font-medium line-clamp-2">{article.title}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="text-xs">
                              {t(article.category.toLowerCase())}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {article.readingTime} {t('readingTime')}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}