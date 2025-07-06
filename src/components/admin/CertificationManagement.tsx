
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Award, Shield, Plus, Edit, Trash2, Save, X, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ImageUpload } from '../ui/image-upload';

interface Certificate {
  id?: string;
  name: string;
  type: 'epa' | 'distributor' | 'quality' | 'safety';
  description: string;
  pdf_url: string;
  image_url?: string;
  is_active: boolean;
  order_index: number;
}

const CertificationManagement = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [formData, setFormData] = useState<Certificate>({
    name: '',
    type: 'epa',
    description: '',
    pdf_url: '',
    image_url: '',
    is_active: true,
    order_index: 0
  });

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch(`${supabase.supabaseUrl}/rest/v1/certificates?order=type.asc,order_index.asc`, {
        headers: {
          'apikey': supabase.supabaseKey,
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch certificates');
      const data = await response.json();
      setCertificates(data || []);
    } catch (error: any) {
      console.error('Error fetching certificates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load certificates.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.pdf_url) {
        toast({
          title: 'Error',
          description: 'Name and PDF are required.',
          variant: 'destructive'
        });
        return;
      }

      const method = editingCert?.id ? 'PATCH' : 'POST';
      const url = editingCert?.id 
        ? `${supabase.supabaseUrl}/rest/v1/certificates?id=eq.${editingCert.id}`
        : `${supabase.supabaseUrl}/rest/v1/certificates`;

      const response = await fetch(url, {
        method,
        headers: {
          'apikey': supabase.supabaseKey,
          'Authorization': `Bearer ${supabase.supabaseKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingCert?.id ? formData : { ...formData, order_index: certificates.length })
      });

      if (!response.ok) throw new Error('Failed to save certificate');

      toast({ 
        title: editingCert ? 'Certificate updated successfully!' : 'Certificate added successfully!' 
      });

      setFormData({ name: '', type: 'epa', description: '', pdf_url: '', image_url: '', is_active: true, order_index: 0 });
      setEditingCert(null);
      setIsAdding(false);
      fetchCertificates();
    } catch (error: any) {
      console.error('Error saving certificate:', error);
      toast({
        title: 'Error',
        description: 'Failed to save certificate.',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${supabase.supabaseUrl}/rest/v1/certificates?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
          'apikey': supabase.supabaseKey,
          'Authorization': `Bearer ${supabase.supabaseKey}`,
        }
      });

      if (!response.ok) throw new Error('Failed to delete certificate');
      toast({ title: 'Certificate deleted successfully!' });
      fetchCertificates();
    } catch (error: any) {
      console.error('Error deleting certificate:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete certificate.',
        variant: 'destructive'
      });
    }
  };

  const startEdit = (cert: Certificate) => {
    setEditingCert(cert);
    setFormData(cert);
    setIsAdding(true);
  };

  const cancelEdit = () => {
    setEditingCert(null);
    setFormData({ name: '', type: 'epa', description: '', pdf_url: '', image_url: '', is_active: true, order_index: 0 });
    setIsAdding(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'epa': return <Shield className="h-4 w-4" />;
      case 'distributor': return <Award className="h-4 w-4" />;
      case 'quality': return <FileText className="h-4 w-4" />;
      case 'safety': return <Shield className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'epa': return 'bg-blue-100 text-blue-800';
      case 'distributor': return 'bg-purple-100 text-purple-800';
      case 'quality': return 'bg-green-100 text-green-800';
      case 'safety': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-6 text-white">Loading certificates...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Certification Management</h1>
        <p className="text-gray-300">Manage certificates and accreditations for your certifications page</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Certificates List */}
        <Card className="bg-slate-800/50 border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certificates ({certificates.length})
              </div>
              <Button
                onClick={() => setIsAdding(true)}
                size="sm"
                className="bg-cyan-500 hover:bg-cyan-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Certificate
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {certificates.map((cert) => (
              <div key={cert.id} className="p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white">{cert.name}</h3>
                    <p className="text-sm text-gray-300 mt-1">{cert.description}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(cert)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(cert.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getTypeColor(cert.type)}>
                    {getTypeIcon(cert.type)}
                    <span className="ml-1 capitalize">{cert.type}</span>
                  </Badge>
                  <Badge variant={cert.is_active ? 'default' : 'secondary'}>
                    {cert.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  {cert.pdf_url && (
                    <Badge variant="outline">
                      <FileText className="h-3 w-3 mr-1" />
                      PDF
                    </Badge>
                  )}
                </div>
              </div>
            ))}
            {certificates.length === 0 && (
              <p className="text-gray-400 text-center py-8">No certificates added yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Form */}
        {isAdding && (
          <Card className="bg-slate-800/50 border-cyan-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                {editingCert ? 'Edit Certificate' : 'Add Certificate'}
                <Button variant="ghost" size="sm" onClick={cancelEdit}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Certificate Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter certificate name"
                />
              </div>

              <div>
                <Label className="text-gray-300">Type *</Label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Certificate['type'] })}
                  className="w-full bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
                >
                  <option value="epa">EPA Certification</option>
                  <option value="distributor">Distributor Agreement</option>
                  <option value="quality">Quality Assurance</option>
                  <option value="safety">Safety & Training</option>
                </select>
              </div>

              <div>
                <Label className="text-gray-300">Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter certificate description"
                  rows={3}
                />
              </div>

              <ImageUpload
                label="Certificate PDF *"
                currentImage={formData.pdf_url}
                onImageUploaded={(url) => setFormData({ ...formData, pdf_url: url })}
                onImageRemoved={() => setFormData({ ...formData, pdf_url: '' })}
                bucket="product-documents"
                folder="certificates"
                accept=".pdf,application/pdf"
              />

              <ImageUpload
                label="Certificate Image (Optional)"
                currentImage={formData.image_url}
                onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
                onImageRemoved={() => setFormData({ ...formData, image_url: '' })}
                bucket="product-images"
                folder="certificates"
              />

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_active" className="text-gray-300">Active</Label>
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-cyan-500 hover:bg-cyan-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingCert ? 'Update Certificate' : 'Add Certificate'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CertificationManagement;
