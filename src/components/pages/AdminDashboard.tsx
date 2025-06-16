
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  sku: string;
  epaApproved: boolean;
  category: string;
  description: string;
  stock: number;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  published: boolean;
}

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'R-134a Refrigerant',
      price: 89.99,
      image: '/placeholder.svg',
      sku: 'R134A-30LB',
      epaApproved: true,
      category: 'HFC',
      description: 'High-quality R-134a refrigerant for automotive applications',
      stock: 50
    }
  ]);

  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: 'New EPA Regulations 2024',
      content: 'Latest updates on EPA refrigerant regulations...',
      author: 'Admin',
      publishDate: '2024-01-15',
      published: true
    }
  ]);

  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    image: '',
    sku: '',
    epaApproved: false,
    category: '',
    description: '',
    stock: 0
  });

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    author: 'Admin',
    published: false
  });

  const handleAddProduct = () => {
    const product: Product = {
      id: Date.now().toString(),
      ...newProduct
    };
    setProducts([...products, product]);
    setNewProduct({
      name: '',
      price: 0,
      image: '',
      sku: '',
      epaApproved: false,
      category: '',
      description: '',
      stock: 0
    });
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleAddBlogPost = () => {
    const post: BlogPost = {
      id: Date.now().toString(),
      ...newPost,
      publishDate: new Date().toISOString().split('T')[0]
    };
    setBlogPosts([...blogPosts, post]);
    setNewPost({
      title: '',
      content: '',
      author: 'Admin',
      published: false
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-gray-300">Manage your products, content, and website</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-cyan-500/20">
            <TabsTrigger value="products" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Products
            </TabsTrigger>
            <TabsTrigger value="blog" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Blog Posts
            </TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              Website Content
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Add New Product */}
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Product
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">Product Name</Label>
                  <Input
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Price</Label>
                  <Input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">SKU</Label>
                  <Input
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Category</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HFC">HFC</SelectItem>
                      <SelectItem value="HFO">HFO</SelectItem>
                      <SelectItem value="Natural">Natural</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-gray-300">Stock</Label>
                  <Input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={newProduct.epaApproved}
                    onCheckedChange={(checked) => setNewProduct({...newProduct, epaApproved: checked as boolean})}
                  />
                  <Label className="text-gray-300">EPA Approved</Label>
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <Label className="text-gray-300">Description</Label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2 lg:col-span-3">
                  <Button onClick={handleAddProduct} className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="bg-slate-800/50 border-cyan-500/20">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-white">{product.name}</h3>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEditProduct(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteProduct(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{product.sku}</p>
                    <p className="text-cyan-400 font-bold">${product.price}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={product.epaApproved ? "default" : "secondary"}>
                        {product.epaApproved ? "EPA Approved" : "Not EPA Approved"}
                      </Badge>
                      <Badge variant="outline">{product.category}</Badge>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">Stock: {product.stock}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="blog" className="space-y-6">
            {/* Add New Blog Post */}
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400 flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New Blog Post
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Title</Label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">Content</Label>
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                    rows={8}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={newPost.published}
                    onCheckedChange={(checked) => setNewPost({...newPost, published: checked as boolean})}
                  />
                  <Label className="text-gray-300">Publish immediately</Label>
                </div>
                <Button onClick={handleAddBlogPost} className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Blog Post
                </Button>
              </CardContent>
            </Card>

            {/* Blog Posts List */}
            <div className="space-y-4">
              {blogPosts.map((post) => (
                <Card key={post.id} className="bg-slate-800/50 border-cyan-500/20">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-2">{post.title}</h3>
                        <p className="text-gray-300 text-sm mb-2">{post.content.substring(0, 100)}...</p>
                        <div className="flex gap-2">
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                          <span className="text-gray-400 text-sm">{post.publishDate}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card className="bg-slate-800/50 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400">Website Content Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Content management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
