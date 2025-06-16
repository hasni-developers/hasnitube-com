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
  FolderOpen, 
  Search, 
  Grid, 
  List, 
  TrendingUp, 
  Calendar,
  FileText,
  Filter,
  SortAsc,
  SortDesc,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient, ApiCategory } from '@/lib/api-client';

export default function CategoriesCloudPage() {
  const { t, isRTL } = useLanguage();
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'count'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await apiClient.fetchCategories();
        if (response.success) {
          setCategories(response.categories);
          setFilteredCategories(response.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = categories.filter(category =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort categories
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        const comparison = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const comparison = a.count - b.count;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });

    setFilteredCategories(filtered);
  }, [categories, searchQuery, sortBy, sortOrder]);

  const getCloudSize = (count: number, maxCount: number) => {
    const minSize = 0.8;
    const maxSize = 2.5;
    const ratio = count / maxCount;
    return minSize + (maxSize - minSize) * ratio;
  };

  const maxCount = Math.max(...categories.map(cat => cat.count));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-primary/5">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-2xl mb-6">
            <FolderOpen className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Categories Cloud
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Explore all news categories on HasniTube. Discover content organized by topics and interests.
          </p>
          <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>{categories.length} categories</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>{categories.reduce((sum, cat) => sum + cat.count, 0)} total articles</span>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-background/80">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search categories..."
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
                      <SelectItem value="count">Post Count</SelectItem>
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

        {/* Categories Display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-6xl mx-auto"
        >
          {filteredCategories.length === 0 ? (
            <Card className="border-border/50 shadow-lg">
              <CardContent className="text-center py-16">
                <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No categories found</h3>
                <p className="text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search terms.' : 'No categories are available at the moment.'}
                </p>
              </CardContent>
            </Card>
          ) : viewMode === 'grid' ? (
            <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-background/80">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FolderOpen className="h-5 w-5 text-primary" />
                  <span>Categories Cloud</span>
                  <Badge variant="secondary">{filteredCategories.length} categories</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-wrap gap-4 justify-center items-center">
                  {filteredCategories.map((category, index) => {
                    const scale = getCloudSize(category.count, maxCount);
                    return (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        whileHover={{ scale: scale * 1.1 }}
                        className="group"
                      >
                        <Link
                          href={`/categories/${category.slug}`}
                          className="inline-block"
                        >
                          <Badge
                            variant="outline"
                            className="text-center hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-pointer border-2 hover:border-primary"
                            style={{
                              fontSize: `${scale}rem`,
                              padding: `${scale * 0.5}rem ${scale * 0.8}rem`,
                              opacity: 0.7 + (category.count / maxCount) * 0.3
                            }}
                          >
                            <span className="font-medium">{category.name}</span>
                            <span className="ml-2 text-xs opacity-70">({category.count})</span>
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
              {filteredCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm bg-background/80">
                    <CardContent className="p-6">
                      <Link href={`/categories/${category.slug}`} className="block">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                <FolderOpen className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {category.name}
                                </h3>
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                  <FileText className="h-3 w-3" />
                                  <span>{category.count} articles</span>
                                </div>
                              </div>
                            </div>
                            {category.description && (
                              <p className="text-muted-foreground text-sm leading-relaxed ml-13">
                                {category.description}
                              </p>
                            )}
                          </div>
                          <Badge variant="secondary" className="ml-4">
                            {category.count}
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
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto mt-16"
        >
          <Card className="border-border/50 shadow-lg backdrop-blur-sm bg-background/80">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">{categories.length}</div>
                  <div className="text-sm text-muted-foreground">Total Categories</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    {categories.reduce((sum, cat) => sum + cat.count, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Articles</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    {Math.round(categories.reduce((sum, cat) => sum + cat.count, 0) / categories.length)}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg. per Category</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}