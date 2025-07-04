
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  published: boolean;
  createdAt: string;
}

const SimpleBlogManagement = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'Understanding R-410A Refrigerant',
      content: 'R-410A is a widely used refrigerant in modern HVAC systems...',
      excerpt: 'Learn about the benefits and applications of R-410A refrigerant.',
      published: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'EPA Regulations for Refrigerant Handling',
      content: 'The EPA has strict regulations for refrigerant handling and disposal...',
      excerpt: 'Stay compliant with EPA regulations for refrigerant handling.',
      published: true,
      createdAt: '2024-01-10'
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    published: false
  });

  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      published: false
    });
    setEditingPost(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({ title: 'Error', description: 'Title and content are required', variant: 'destructive' });
      return;
    }

    if (editingPost) {
      setPosts(posts.map(post => 
        post.id === editingPost.id 
          ? { ...post, ...formData }
          : post
      ));
      toast({ title: 'Blog post updated successfully!' });
    } else {
      const newPost: BlogPost = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setPosts([newPost, ...posts]);
      toast({ title: 'Blog post created successfully!' });
    }
    
    setActiveTab('list');
    resetForm();
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      published: post.published
    });
    setActiveTab('form');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setPosts(posts.filter(post => post.id !== id));
      toast({ title: 'Blog post deleted successfully!' });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Blog Management</h1>
        <p className="text-gray-300">Create and manage blog posts</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="list">Blog Posts</TabsTrigger>
          <TabsTrigger value="form">
            {editingPost ? 'Edit Post' : 'New Post'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Blog Posts ({posts.length})</CardTitle>
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
                New Post
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.length > 0 ? (
                  posts.map((post) => (
                    <div key={post.id} className="border border-slate-600 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <FileText className="h-5 w-5 text-cyan-400" />
                            <h3 className="text-white font-medium">{post.title}</h3>
                            {post.published ? (
                              <span className="bg-green-600 text-white px-2 py-1 rounded text-xs">Published</span>
                            ) : (
                              <span className="bg-gray-600 text-white px-2 py-1 rounded text-xs">Draft</span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{post.excerpt}</p>
                          <p className="text-gray-500 text-xs">Created: {post.createdAt}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
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
                            onClick={() => handleDelete(post.id)}
                            className="border-red-500/50 text-red-400 hover:bg-red-500/10"
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="form">
          <form onSubmit={handleSubmit}>
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white">
                  {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Title *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter blog post title"
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Excerpt</Label>
                  <Input
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Brief description of the post"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Content *</Label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={10}
                    placeholder="Write your blog post content here..."
                    required
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded"
                  />
                  <Label className="text-gray-300">Publish immediately</Label>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-4 mt-6">
              <Button 
                type="submit" 
                className="bg-cyan-500 hover:bg-cyan-600"
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimpleBlogManagement;
