
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, FileText, Eye } from 'lucide-react';
import { useToast } from '../ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  body: string;
  banner_image_url: string;
  author_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const BlogPostManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    published: false
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Fetch blog posts
  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BlogPost[];
    }
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([postData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({ title: 'Blog post created successfully!' });
      setActiveTab('list');
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Error creating post', description: error.message, variant: 'destructive' });
    }
  });

  // Update post mutation
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, ...postData }: Partial<BlogPost> & { id: string }) => {
      const { data, error } = await supabase
        .from('blog_posts')
        .update(postData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({ title: 'Blog post updated successfully!' });
      setActiveTab('list');
      resetForm();
    },
    onError: (error) => {
      toast({ title: 'Error updating post', description: error.message, variant: 'destructive' });
    }
  });

  // Delete post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({ title: 'Blog post deleted successfully!' });
    },
    onError: (error) => {
      toast({ title: 'Error deleting post', description: error.message, variant: 'destructive' });
    }
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const resetForm = () => {
    setFormData({ title: '', body: '', published: false });
    setEditingPost(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({ title: 'Error', description: 'User not authenticated', variant: 'destructive' });
      return;
    }

    const slug = generateSlug(formData.title);
    const postData = {
      ...formData,
      slug,
      banner_image_url: '/placeholder.svg',
      author_id: user.id
    };

    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost.id, ...postData });
    } else {
      createPostMutation.mutate(postData);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      body: post.body || '',
      published: post.published || false
    });
    setActiveTab('form');
  };

  const togglePublished = async (post: BlogPost) => {
    updatePostMutation.mutate({
      id: post.id,
      published: !post.published
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-white">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Blog Post Management</h1>
        <p className="text-gray-300">Create and manage your blog content</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="list">Post List</TabsTrigger>
          <TabsTrigger value="form">
            {editingPost ? 'Edit Post' : 'Add Post'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Blog Posts</CardTitle>
                <CardDescription className="text-gray-300">
                  Manage your blog content
                </CardDescription>
              </div>
              <Button 
                onClick={() => {
                  resetForm();
                  setActiveTab('form');
                }}
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Post
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts?.map((post) => (
                  <div key={post.id} className="border border-slate-600 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium">{post.title}</h3>
                          <p className="text-gray-400 text-sm">/{post.slug}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge variant={post.published ? "default" : "secondary"}>
                              {post.published ? 'Published' : 'Draft'}
                            </Badge>
                            <span className="text-gray-400 text-sm">
                              {new Date(post.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-2 mr-4">
                          <label className="text-sm text-gray-300">Published</label>
                          <Switch
                            checked={post.published}
                            onCheckedChange={() => togglePublished(post)}
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(post)}
                          className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deletePostMutation.mutate(post.id)}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {!posts?.length && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-400">No blog posts found. Create your first post!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white">
                {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
              </CardTitle>
              <CardDescription className="text-gray-300">
                {editingPost ? 'Update your blog post' : 'Write a new blog post'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter post title"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                  {formData.title && (
                    <p className="text-sm text-gray-400 mt-1">
                      Slug: /{generateSlug(formData.title)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Content
                  </label>
                  <Textarea
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    placeholder="Write your blog post content here..."
                    rows={12}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <label className="text-sm text-white">
                    Publish immediately
                  </label>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    type="submit" 
                    className="bg-cyan-500 hover:bg-cyan-600"
                    disabled={createPostMutation.isPending || updatePostMutation.isPending}
                  >
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      resetForm();
                      setActiveTab('list');
                    }}
                    className="border-slate-600 text-gray-300 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlogPostManagement;
