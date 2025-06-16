import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Home, 
  FileText, 
  FolderOpen, 
  Tag, 
  Info, 
  Mail, 
  Shield, 
  ScrollText,
  Rss,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Sitemap - HasniTube',
  description: 'Complete sitemap of HasniTube website including all pages, categories, and articles.',
  robots: 'index, follow',
};

async function fetchCategories() {
  const baseUrl = 'http://www.hasnitube.com';
  
  try {
    const response = await fetch(`${baseUrl}/api/categories`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.success ? data.categories : [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

async function fetchRecentPosts() {
  const baseUrl = 'http://www.hasnitube.com';
  
  try {
    const response = await fetch(`${baseUrl}/api/posts?per_page=20&orderby=date&order=desc`, {
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    return data.success ? data.posts : [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    return [];
  }
}

export default async function SitemapPage() {
  const [categories, recentPosts] = await Promise.all([
    fetchCategories(),
    fetchRecentPosts()
  ]);

  const staticPages = [
    { name: 'Home', href: '/', icon: Home, description: 'Latest news and updates' },
    { name: 'About Us', href: '/about', icon: Info, description: 'Learn about HasniTube' },
    { name: 'Contact', href: '/contact', icon: Mail, description: 'Get in touch with us' },
    { name: 'Privacy Policy', href: '/privacy', icon: Shield, description: 'Our privacy policy' },
    { name: 'Terms of Service', href: '/terms', icon: ScrollText, description: 'Terms and conditions' },
    { name: 'RSS Feed', href: '/rss', icon: Rss, description: 'Subscribe to our RSS feed' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Website Sitemap
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Navigate through all pages and content on HasniTube. Find exactly what you're looking for.
          </p>
        </motion.div>

        <div className="grid gap-8 max-w-6xl mx-auto">
          {/* Main Pages */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Home className="h-5 w-5 text-primary" />
                  <span>Main Pages</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {staticPages.map((page, index) => (
                    <motion.div
                      key={page.href}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                      className="group"
                    >
                      <Link
                        href={page.href}
                        className="block p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-accent/50 transition-all duration-200"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <page.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {page.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {page.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* Categories */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="h-5 w-5 text-primary" />
                    <span>Categories</span>
                  </div>
                  <Badge variant="secondary">{categories.length} categories</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {categories.length === 0 ? (
                  <div className="text-center py-8">
                    <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No categories available</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((category: any, index: number) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.03 }}
                        whileHover={{ scale: 1.02 }}
                        className="group"
                      >
                        <Link
                          href={`/categories/${category.slug}`}
                          className="block p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-accent/50 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {category.name}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {category.count} posts
                            </Badge>
                          </div>
                          {category.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {category.description}
                            </p>
                          )}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.section>

          {/* Recent Articles */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span>Recent Articles</span>
                  </div>
                  <Badge variant="secondary">{recentPosts.length} recent posts</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No articles available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentPosts.slice(0, 15).map((post: any, index: number) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className="group"
                      >
                        <Link
                          href={`/${post.slug}`}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                              {post.title.rendered}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {new Date(post.date).toLocaleDateString()}
                              </span>
                              {post._embedded?.['wp:term']?.[0]?.[0] && (
                                <>
                                  <span className="text-xs text-muted-foreground">•</span>
                                  <Badge variant="outline" className="text-xs">
                                    {post._embedded['wp:term'][0][0].name}
                                  </Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </Link>
                        {index < recentPosts.length - 1 && <Separator className="mt-3" />}
                      </motion.div>
                    ))}
                    
                    {recentPosts.length > 15 && (
                      <div className="text-center pt-4">
                        <p className="text-sm text-muted-foreground">
                          And {recentPosts.length - 15} more articles...
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.section>

          {/* XML Sitemap */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>For Search Engines</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <h3 className="font-semibold mb-1">XML Sitemap</h3>
                    <p className="text-sm text-muted-foreground">
                      Machine-readable sitemap for search engines and crawlers
                    </p>
                  </div>
                  <Link
                    href="/sitemap.xml"
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View XML
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-muted-foreground">
            This sitemap is automatically updated as new content is published.
            <br />
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </motion.div>
      </div>
    </div>
  );
}