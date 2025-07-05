
import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  onImageRemoved?: () => void;
  label?: string;
  accept?: string;
  bucket?: string;
  folder?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageUploaded,
  currentImage,
  onImageRemoved,
  label = "Upload Image",
  accept = "image/*",
  bucket = "product-images",
  folder = "uploads"
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentImage || '');
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;
      setPreview(imageUrl);
      onImageUploaded(imageUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const removeImage = () => {
    setPreview('');
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-white">{label}</Label>
      
      {preview ? (
        <div className="relative">
          <img 
            src={preview} 
            alt="Preview" 
            className="w-full h-48 object-cover rounded-lg border border-slate-600"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={removeImage}
            className="absolute top-2 right-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
          <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No image selected</p>
        </div>
      )}

      <div className="flex items-center space-x-2">
        <Input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={uploading}
          className="bg-slate-700 border-slate-600 text-white file:bg-slate-600 file:text-white file:border-0 file:rounded-md"
        />
        <Button
          type="button"
          disabled={uploading}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </div>
  );
};
