
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface BlogPost {
  id: string;
  title: string;
  body: string;
  slug: string;
  excerpt: string;
  banner_image_url: string;
  featured_image_url: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  reading_time: number;
  tags: string[];
}

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      console.log('Fetching published blog posts...');
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
      }
      
      console.log('Blog posts fetched:', data);
      return data as BlogPost[];
    },
  });

  // Get all unique tags
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags || [])));

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'all' || (post.tags && post.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Error Loading Posts</h1>
          <p className="text-gray-300">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Refrigerant News & HVAC Updates | Alper</title>
        <meta name="description" content="Stay informed with refrigerant industry news, EPA regulation updates, HVAC technology trends, and expert insights from Alper Refrigerants. Professional resources for contractors." />
        <meta name="keywords" content="refrigerant news, HVAC industry updates, EPA regulations, refrigerant technology, contractor resources, industry insights" />
        <link rel="canonical" href="https://alperrefrigas.com/blog" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Industry <span className="text-cyan-400">News</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Stay informed with the latest updates, regulations, and insights in the refrigerant industry
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedTag === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedTag('all')}
                className={selectedTag === 'all' ? 'bg-cyan-500 hover:bg-cyan-600' : 'border-slate-600 text-gray-300'}
              >
                All
              </Button>
              {allTags.map(tag => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  onClick={() => setSelectedTag(tag)}
                  className={selectedTag === tag ? 'bg-cyan-500 hover:bg-cyan-600' : 'border-slate-600 text-gray-300'}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="text-white text-lg">Loading articles...</div>
            </div>
          )}

          {/* Blog Posts Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="bg-slate-800/50 border-slate-700 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10">
                  <div className="relative">
                    {(post.banner_image_url || post.featured_image_url) && (
                      <img 
                        src={post.banner_image_url || post.featured_image_url} 
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                    )}
                    <div className="absolute top-4 left-4">
                      {post.tags && post.tags.map(tag => (
                        <Badge key={tag} className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mr-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-white text-xl leading-tight line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 line-clamp-3">
                      {post.excerpt || post.body?.substring(0, 150) + '...'}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.reading_time || 5} min read</span>
                        </div>
                      </div>
                    </div>
                    
                    <Link to={`/blog/${post.slug}`}>
                      <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-white mb-4">No articles found</h3>
              <p className="text-gray-400">
                {searchTerm || selectedTag !== 'all' 
                  ? 'Try adjusting your search criteria' 
                  : 'Check back soon for new content!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
