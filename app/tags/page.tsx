'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/language-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Tag, 
  Search, 
  Grid, 
  List, 
  TrendingUp, 
  Hash,
  FileText,
  Filter,
  SortAsc,
  SortDesc,
  Loader2,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient, ApiTag } from '@/lib/api-client';

export default function TagsCloudPage() {
  const { t, isRTL } = useLanguage();
  const [tags, setTags] = useState<ApiTag[]>([]);
  const [filteredTags, setFilteredTags] = useState<ApiTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'count'>('count');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await apiClient.fetchTags();
        if (response.success) {
          setTags(response.tags);
          setFilteredTags(response.tags);
        }
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    let filtered = tags.filter(tag =>
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort tags
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        const comparison = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const comparison = a.count - b.count;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });

    setFilteredTags(filtered);
  }, [tags, searchQuery, sortBy, sortOrder]);

  const getCloudSize = (count: number, maxCount: number) => {
    const minSize = 0.7;
    const maxSize = 2.2;
    const ratio = count / maxCount;
    return minSize + (maxSize - minSize) * ratio;
  };

  const getTagColor = (count: number, maxCount: number) => {
    const ratio = count / maxCount;
    if (ratio > 0.8) return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
    if (ratio > 0.6) return 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white';
    if (ratio > 0.4) return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
    if (ratio > 0.2) return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';
    return 'bg-gradient-to-r from-gray-500 to-slate-500 text-white';
  };

  const maxCount = Math.max(...tags.map(tag => tag.count));
  const popularTags = tags.filter(tag => tag.count >= maxCount * 0.5).slice(0, 10);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading tags...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-purple-50/20 to-blue-50/20 dark:via-purple-950/10 dark:to-blue-950/10">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl mb-6">
            <Hash className="h-10 w-10 text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Tags Cloud
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover trending topics and explore content through our comprehensive tag system.
          </p>
          <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Tag className="h-4 w-4" />
              <span>{tags.length} tags</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>{popularTags.length} trending</span>
            </div>
          </div>
        </motion.div>

        {/* Popular Tags Section */}
        {popularTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-background/80">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <span>Trending Tags</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3 justify-center">
                  {popularTags.map((tag, index) => (
                    <motion.div
                      key={tag.id}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Link href={`/tags/${tag.slug}`}>
                        <Badge
                          className={`${getTagColor(tag.count, maxCount)} hover:shadow-lg transition-all duration-300 cursor-pointer px-4 py-2`}
                        >
                          <Hash className="h-3 w-3 mr-1" />
                          {tag.name} ({tag.count})
                        </Badge>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-background/80">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Sort Controls */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={sortBy} onValueChange={(value: 'name' | 'count') => setSortBy(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="count">Usage</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                </div>

                {/* View Mode */}
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
            </CardContent>
          </Card>
        </motion.div>

        {/* Tags Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-6xl mx-auto"
        >
          {filteredTags.length === 0 ? (
            <Card className="border-border/50 shadow-lg">
              <CardContent className="text-center py-16">
                <Tag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tags found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search terms.' : 'No tags are available at the moment.'}
                </p>
              </CardContent>
            </Card>
          ) : viewMode === 'grid' ? (
            <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-background/80">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Hash className="h-5 w-5 text-purple-600" />
                  <span>All Tags</span>
                  <Badge variant="secondary">{filteredTags.length} tags</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-wrap gap-3 justify-center items-center">
                  {filteredTags.map((tag, index) => {
                    const scale = getCloudSize(tag.count, maxCount);
                    return (
                      <motion.div
                        key={tag.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.02 }}
                        whileHover={{ scale: scale * 1.1 }}
                        className="group"
                      >
                        <Link
                          href={`/tags/${tag.slug}`}
                          className="inline-block"
                        >
                          <Badge
                            variant="outline"
                            className="text-center hover:bg-purple-600 hover:text-white transition-all duration-300 cursor-pointer border-2 hover:border-purple-600 hover:shadow-lg"
                            style={{
                              fontSize: `${scale}rem`,
                              padding: `${scale * 0.4}rem ${scale * 0.7}rem`,
                              opacity: 0.6 + (tag.count / maxCount) * 0.4
                            }}
                          >
                            <Hash className="h-3 w-3 mr-1" style={{ fontSize: `${scale * 0.8}rem` }} />
                            <span className="font-medium">{tag.name}</span>
                            <span className="ml-2 text-xs opacity-70">({tag.count})</span>
                          </Badge>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTags.map((tag, index) => (
                <motion.div
                  key={tag.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.03 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-background/80">
                    <CardContent className="p-6">
                      <Link href={`/tags/${tag.slug}`} className="block">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                                <Hash className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-foreground group-hover:text-purple-600 transition-colors">
                                  #{tag.name}
                                </h3>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <FileText className="h-3 w-3" />
                                  <span>{tag.count} articles</span>
                                </div>
                              </div>
                            </div>
                            {tag.description && (
                              <p className="text-muted-foreground text-sm leading-relaxed ml-13">
                                {tag.description}
                              </p>
                            )}
                          </div>
                          <Badge 
                            variant="secondary" 
                            className={`ml-4 ${getTagColor(tag.count, maxCount)}`}
                          >
                            {tag.count}
                          </Badge>
                        </div>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-background/80">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">{tags.length}</div>
                  <div className="text-sm text-muted-foreground">Total Tags</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">
                    {tags.reduce((sum, tag) => sum + tag.count, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Usage</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">{popularTags.length}</div>
                  <div className="text-sm text-muted-foreground">Trending Tags</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(tags.reduce((sum, tag) => sum + tag.count, 0) / tags.length)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg. Usage</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}