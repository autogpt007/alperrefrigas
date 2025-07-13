
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, FileText, Eye, EyeOff, Image, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Editor } from '@tinymce/tinymce-react';

interface BlogPost {
  id: string;
  title: string;
  body: string;
  slug: string;
  excerpt: string;
  banner_image_url: string;
  featured_image_url: string;
  published: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
}

const BlogPostManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    slug: '',
    excerpt: '',
    banner_image_url: '',
    featured_image_url: '',
    published: false
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [featuredFile, setFeaturedFile] = useState<File | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch blog posts
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ['admin-blog-posts'],
    queryFn: async () => {
      console.log('Fetching blog posts...');
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
      }
      
      console.log('Blog posts fetched:', data);
      return data as BlogPost[];
    },
    retry: 3,
    retryDelay: 1000,
  });

  // Upload image function for both banner and featured images
  const uploadImage = async (file: File, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  // Generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // Create blog post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: any) => {
      console.log('Creating blog post with data:', postData);
      
      let bannerUrl = postData.banner_image_url;
      let featuredUrl = postData.featured_image_url;
      
      if (bannerFile) {
        bannerUrl = await uploadImage(bannerFile, 'banners');
      }
      
      if (featuredFile) {
        featuredUrl = await uploadImage(featuredFile, 'featured');
      }

      const finalPostData = {
        ...postData,
        banner_image_url: bannerUrl,
        featured_image_url: featuredUrl,
        slug: postData.slug || generateSlug(postData.title),
        author_id: null // You might want to get this from auth context
      };

      console.log('Final post data to insert:', finalPostData);

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([finalPostData])
        .select()
        .single();
      
      if (error) {
        console.error('Error creating blog post:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({ title: 'Blog post created successfully!' });
      setActiveTab('list');
      resetForm();
    },
    onError: (error: any) => {
      console.error('Create blog post error:', error);
      toast({ title: 'Error creating blog post', description: error.message, variant: 'destructive' });
    }
  });

  // Update blog post mutation
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, ...postData }: any) => {
      console.log('Updating blog post:', id, postData);
      
      let bannerUrl = postData.banner_image_url;
      let featuredUrl = postData.featured_image_url;
      
      if (bannerFile) {
        bannerUrl = await uploadImage(bannerFile, 'banners');
      }
      
      if (featuredFile) {
        featuredUrl = await uploadImage(featuredFile, 'featured');
      }

      const finalPostData = {
        ...postData,
        banner_image_url: bannerUrl,
        featured_image_url: featuredUrl,
        slug: postData.slug || generateSlug(postData.title),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('blog_posts')
        .update(finalPostData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating blog post:', error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({ title: 'Blog post updated successfully!' });
      setActiveTab('list');
      resetForm();
    },
    onError: (error: any) => {
      console.error('Update blog post error:', error);
      toast({ title: 'Error updating blog post', description: error.message, variant: 'destructive' });
    }
  });

  // Delete blog post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting blog post:', id);
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting blog post:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] });
      toast({ title: 'Blog post deleted successfully!' });
    },
    onError: (error: any) => {
      console.error('Delete blog post error:', error);
      toast({ title: 'Error deleting blog post', description: error.message, variant: 'destructive' });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      body: '',
      slug: '',
      excerpt: '',
      banner_image_url: '',
      featured_image_url: '',
      published: false
    });
    setEditingPost(null);
    setBannerFile(null);
    setFeaturedFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast({ title: 'Error', description: 'Title is required', variant: 'destructive' });
      return;
    }

    const postData = {
      ...formData,
      slug: formData.slug || generateSlug(formData.title)
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
      slug: post.slug,
      excerpt: post.excerpt || '',
      banner_image_url: post.banner_image_url || '',
      featured_image_url: post.featured_image_url || '',
      published: post.published || false
    });
    setActiveTab('form');
  };

  if (error) {
    console.error('BlogPostManagement error:', error);
    return (
      <div className="p-6">
        <div className="text-red-400">Error loading blog posts: {error.message}</div>
        <Button 
          onClick={() => queryClient.invalidateQueries({ queryKey: ['admin-blog-posts'] })}
          className="mt-4 bg-cyan-500 hover:bg-cyan-600"
        >
          Retry
        </Button>
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
          <TabsTrigger value="list">Blog Posts</TabsTrigger>
          <TabsTrigger value="form">
            {editingPost ? 'Edit Post' : 'Create Post'}
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
                Create Post
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="text-white">Loading blog posts...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <div key={post.id} className="border border-slate-600 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center">
                              {post.banner_image_url ? (
                                <img src={post.banner_image_url} alt={post.title} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <FileText className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-white font-medium">{post.title}</h3>
                              <p className="text-gray-400 text-sm">Slug: /{post.slug}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <Badge variant={post.published ? "default" : "secondary"}>
                                  {post.published ? (
                                    <>
                                      <Eye className="h-3 w-3 mr-1" />
                                      Published
                                    </>
                                  ) : (
                                    <>
                                      <EyeOff className="h-3 w-3 mr-1" />
                                      Draft
                                    </>
                                  )}
                                </Badge>
                                <span className="text-gray-400 text-sm">
                                  {new Date(post.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
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
                              disabled={deletePostMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-400">No blog posts found. Create your first post!</p>
                    </div>
                  )}
                </div>
              )}
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
                {editingPost ? 'Update blog post content' : 'Create a new blog post for your audience'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="block text-sm font-medium text-white mb-2">
                      Post Title *
                    </Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setFormData({ 
                          ...formData, 
                          title,
                          slug: formData.slug || generateSlug(title)
                        });
                      }}
                      placeholder="Enter post title"
                      required
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="block text-sm font-medium text-white mb-2">
                      URL Slug
                    </Label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="url-slug-for-post"
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-medium text-white mb-2">
                    Banner Image
                  </Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                  />
                  {bannerFile && (
                    <div className="mt-2 text-green-400 text-sm">
                      Banner image selected: {bannerFile.name}
                    </div>
                  )}
                </div>

                <div>
                  <Label className="block text-sm font-medium text-white mb-2">
                    Excerpt *
                  </Label>
                  <Textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief description of the blog post (shown in previews)"
                    rows={3}
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium text-white mb-2">
                    Featured Image
                  </Label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFeaturedFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                  />
                  {featuredFile && (
                    <div className="mt-2 text-green-400 text-sm">
                      Featured image selected: {featuredFile.name}
                    </div>
                  )}
                  <p className="text-gray-400 text-sm mt-1">This image shows in blog listings and social sharing</p>
                </div>

                <div>
                  <Label className="block text-sm font-medium text-white mb-2">
                    Content * (WordPress-style Editor)
                  </Label>
                  <div className="bg-white rounded-lg">
                    <Editor
                      apiKey="no-api-key"
                      value={formData.body}
                      onEditorChange={(content) => setFormData({ ...formData, body: content })}
                      init={{
                        height: 500,
                        menubar: true,
                        plugins: [
                          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                          'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                          'paste', 'codesample', 'emoticons'
                        ],
                        toolbar: 'undo redo | blocks | ' +
                          'bold italic forecolor | alignleft aligncenter ' +
                          'alignright alignjustify | bullist numlist outdent indent | ' +
                          'removeformat | image media link | codesample emoticons | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        images_upload_handler: async (blobInfo: any, progress: any) => {
                          return new Promise(async (resolve, reject) => {
                            try {
                              const file = blobInfo.blob();
                              const fileExt = file.name?.split('.').pop() || 'png';
                              const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                              const filePath = `blog-content/${fileName}`;

                              const { data, error } = await supabase.storage
                                .from('product-images')
                                .upload(filePath, file);

                              if (error) throw error;

                              const { data: urlData } = supabase.storage
                                .from('product-images')
                                .getPublicUrl(filePath);

                              resolve(urlData.publicUrl);
                            } catch (error) {
                              reject('Image upload failed');
                            }
                          });
                        },
                        automatic_uploads: true,
                        file_picker_types: 'image media',
                        media_live_embeds: true,
                        paste_data_images: true
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <Label className="text-white">Publish immediately</Label>
                </div>

                <div className="flex space-x-4">
                  <Button 
                    type="submit" 
                    className="bg-cyan-500 hover:bg-cyan-600"
                    disabled={createPostMutation.isPending || updatePostMutation.isPending}
                  >
                    {createPostMutation.isPending || updatePostMutation.isPending 
                      ? 'Saving...' 
                      : editingPost ? 'Update Post' : 'Create Post'
                    }
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
