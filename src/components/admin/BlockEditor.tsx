import React, { useState } from 'react';
import { PageBlock } from '@/types/page-blocks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Editor } from '@tinymce/tinymce-react';

interface BlockEditorProps {
  block: PageBlock;
  onSave: (content: any) => void;
}

const BlockEditor: React.FC<BlockEditorProps> = ({ block, onSave }) => {
  const [content, setContent] = useState(block.content);
  const [jsonContent, setJsonContent] = useState(JSON.stringify(block.content, null, 2));

  const handleSaveVisual = () => {
    onSave(content);
  };

  const handleSaveCode = () => {
    try {
      const parsed = JSON.parse(jsonContent);
      onSave(parsed);
    } catch (e) {
      alert('Invalid JSON format');
    }
  };

  const renderVisualEditor = () => {
    switch (block.block_type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Textarea
                value={content.subtitle || ''}
                onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={content.buttonText || ''}
                onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input
                value={content.buttonLink || ''}
                onChange={(e) => setContent({ ...content, buttonLink: e.target.value })}
              />
            </div>
            <div>
              <Label>Background Image URL</Label>
              <Input
                value={content.backgroundImage || ''}
                onChange={(e) => setContent({ ...content, backgroundImage: e.target.value })}
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title (Optional)</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Content</Label>
              <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY || 'no-api-key'}
                value={content.content || ''}
                onEditorChange={(newContent) => setContent({ ...content, content: newContent })}
                init={{
                  height: 400,
                  menubar: false,
                  plugins: ['lists', 'link', 'image', 'code'],
                  toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image | code'
                }}
              />
            </div>
          </div>
        );

      case 'cta':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={content.description || ''}
                onChange={(e) => setContent({ ...content, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={content.buttonText || ''}
                onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input
                value={content.buttonLink || ''}
                onChange={(e) => setContent({ ...content, buttonLink: e.target.value })}
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label>Image URL</Label>
              <Input
                value={content.url || ''}
                onChange={(e) => setContent({ ...content, url: e.target.value })}
              />
            </div>
            <div>
              <Label>Alt Text</Label>
              <Input
                value={content.alt || ''}
                onChange={(e) => setContent({ ...content, alt: e.target.value })}
              />
            </div>
            <div>
              <Label>Caption (Optional)</Label>
              <Input
                value={content.caption || ''}
                onChange={(e) => setContent({ ...content, caption: e.target.value })}
              />
            </div>
          </div>
        );

      default:
        return <p className="text-muted-foreground">Use Code Editor for this block type</p>;
    }
  };

  return (
    <div className="mt-4 border-t pt-4">
      <Tabs defaultValue="visual">
        <TabsList>
          <TabsTrigger value="visual">Visual Editor</TabsTrigger>
          <TabsTrigger value="code">Code Editor</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-4">
          {renderVisualEditor()}
          <Button onClick={handleSaveVisual}>Save Changes</Button>
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          <div>
            <Label>JSON Content</Label>
            <Textarea
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              rows={15}
              className="font-mono text-sm"
            />
          </div>
          <Button onClick={handleSaveCode}>Save Changes</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BlockEditor;
