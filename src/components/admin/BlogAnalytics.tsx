import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Globe, TrendingUp, Users } from 'lucide-react';

interface BlogPostWithStats {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  total_views?: number;
  unique_views?: number;
  country_stats?: Record<string, { count: number; name: string }>;
}

const BlogAnalytics = () => {
  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ['blog-analytics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          id,
          title,
          slug,
          created_at,
          blog_post_stats (
            total_views,
            unique_views,
            country_stats
          )
        `)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(post => ({
        ...post,
        total_views: post.blog_post_stats?.[0]?.total_views || 0,
        unique_views: post.blog_post_stats?.[0]?.unique_views || 0,
        country_stats: post.blog_post_stats?.[0]?.country_stats || {}
      })) as unknown as BlogPostWithStats[];

    }
  });

  const totalViews = blogPosts?.reduce((sum, post) => sum + (post.total_views || 0), 0) || 0;
  const totalUniqueViews = blogPosts?.reduce((sum, post) => sum + (post.unique_views || 0), 0) || 0;

  // Aggregate country data
  const countryStats = blogPosts?.reduce((acc, post) => {
    Object.entries(post.country_stats || {}).forEach(([code, data]) => {
      if (!acc[code]) {
        acc[code] = { count: 0, name: data.name };
      }
      acc[code].count += data.count;
    });
    return acc;
  }, {} as Record<string, { count: number; name: string }>);

  const topCountries = Object.entries(countryStats || {})
    .sort(([,a], [,b]) => b.count - a.count)
    .slice(0, 5);

  if (isLoading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Views</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUniqueViews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(countryStats || {}).length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posts</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blogPosts?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Countries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCountries.map(([code, data]) => (
                <div key={code} className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{code}</span>
                    <span className="text-sm text-muted-foreground">{data.name}</span>
                  </div>
                  <Badge variant="secondary">{data.count} views</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Viewed Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {blogPosts
                ?.sort((a, b) => (b.total_views || 0) - (a.total_views || 0))
                .slice(0, 5)
                .map(post => (
                  <div key={post.id} className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{post.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {post.unique_views} unique views
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {post.total_views} views
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Posts Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {blogPosts?.map(post => {
              const topCountry = Object.entries(post.country_stats || {})
                .sort(([,a], [,b]) => b.count - a.count)[0];
              
              return (
                <div key={post.id} className="flex justify-between items-center p-4 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Published {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    {topCountry && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Top country: {topCountry[1].name} ({topCountry[1].count} views)
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{post.total_views} views</p>
                    <p className="text-xs text-muted-foreground">{post.unique_views} unique</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogAnalytics;