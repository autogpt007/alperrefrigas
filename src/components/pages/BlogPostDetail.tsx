import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet-async';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

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

const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: async () => {
      console.log('Fetching blog post with slug:', slug);
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching blog post:', error);
        throw error;
      }
      
      console.log('Blog post fetched:', data);
      return data as BlogPost | null;
    },
    enabled: !!slug,
  });

  const handleShare = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-white text-lg">Loading article...</div>
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Blog post error:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-4">Error Loading Post</h1>
            <p className="text-gray-300 mb-4">There was an error loading this blog post.</p>
            <p className="text-sm text-gray-400 mb-4">Slug: {slug}</p>
            <button 
              onClick={() => window.location.href = '/blog'} 
              className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <p className="text-gray-300 mb-4">The blog post you're looking for doesn't exist.</p>
            <p className="text-sm text-gray-400 mb-4">Slug: {slug}</p>
            <button 
              onClick={() => window.location.href = '/blog'} 
              className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} - North American Refrigerants</title>
        <meta name="description" content={post.excerpt || post.body?.substring(0, 160)} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || post.body?.substring(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={window.location.href} />
        {(post.banner_image_url || post.featured_image_url) && (
          <meta property="og:image" content={post.banner_image_url || post.featured_image_url} />
        )}
        <meta name="article:published_time" content={post.created_at} />
        <meta name="article:modified_time" content={post.updated_at} />
        {post.tags && post.tags.map(tag => (
          <meta key={tag} name="article:tag" content={tag} />
        ))}
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="text-gray-400 hover:text-white">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-500" />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/blog" className="text-gray-400 hover:text-white">News</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-gray-500" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white">{post.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Back Button */}
          <Link to="/blog" className="inline-block mb-8">
            <Button variant="outline" className="border-slate-600 text-gray-300 hover:bg-slate-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Button>
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags && post.tags.map(tag => (
                <Badge key={tag} className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="flex items-center justify-between text-sm text-gray-400 mb-8">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{post.reading_time || 5} min read</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="border-slate-600 text-gray-300 hover:bg-slate-800"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </header>

          {/* Featured Image */}
          {(post.banner_image_url || post.featured_image_url) && (
            <div className="mb-8">
              <img 
                src={post.banner_image_url || post.featured_image_url} 
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Article Content */}
          <article className="prose prose-lg prose-invert max-w-none">
            <div 
              className="text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.body }}
            />
          </article>

          {/* Article Footer */}
          <footer className="mt-12 pt-8 border-t border-slate-700">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-gray-400 mb-2">Published on {new Date(post.created_at).toLocaleDateString()}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-gray-400">Tags:</span>
                    {post.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="border-slate-600 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <Button
                onClick={handleShare}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Article
              </Button>
            </div>
          </footer>

          {/* Navigation */}
          <div className="mt-12 text-center">
            <Link to="/blog">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Articles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPostDetail;