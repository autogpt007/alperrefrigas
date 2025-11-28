import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePageBlocks } from '@/hooks/usePageBlocks';
import { AVAILABLE_PAGES, BLOCK_TYPE_LABELS, BlockType } from '@/types/page-blocks';
import BlockEditor from './BlockEditor';
import { Plus, GripVertical, Trash2 } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableBlockProps {
  block: any;
  index: number;
  editingBlockId: string | null;
  setEditingBlockId: (id: string | null) => void;
  updateBlock: (data: any) => void;
  deleteBlock: (id: string) => void;
}

const SortableBlock: React.FC<SortableBlockProps> = ({
  block,
  index,
  editingBlockId,
  setEditingBlockId,
  updateBlock,
  deleteBlock,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="bg-card border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div {...attributes} {...listeners}>
            <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
          </div>
          <span className="font-semibold">
            {BLOCK_TYPE_LABELS[block.block_type]}
          </span>
          <span className="text-sm text-muted-foreground">
            ({block.section_key})
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditingBlockId(editingBlockId === block.id ? null : block.id)}
          >
            {editingBlockId === block.id ? 'Close' : 'Edit'}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => deleteBlock(block.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {editingBlockId === block.id && (
        <BlockEditor
          block={block}
          onSave={(content) => {
            updateBlock({ id: block.id, content });
            setEditingBlockId(null);
          }}
        />
      )}
    </div>
  );
};

const PageContentManagement: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState('home');
  const { blocks, isLoading, updateBlock, reorderBlocks, deleteBlock, addBlock } = usePageBlocks(selectedPage);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [showAddBlock, setShowAddBlock] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);

      const reorderedBlocks = arrayMove(blocks, oldIndex, newIndex);
      const updates = reorderedBlocks.map((block, index) => ({
        id: block.id,
        order_index: index
      }));

      reorderBlocks(updates);
    }
  };

  const handleAddBlock = (blockType: BlockType) => {
    const defaultContent = {
      hero: { title: 'New Hero', subtitle: 'Subtitle here', buttonText: 'Learn More', buttonLink: '#' },
      features: { title: 'Features', items: [{ icon: 'Star', title: 'Feature 1', description: 'Description' }] },
      cta: { title: 'Call to Action', description: 'Description', buttonText: 'Get Started', buttonLink: '#' },
      text: { content: '<p>Your content here</p>' },
      image: { url: '', alt: 'Image' },
      video: { url: '' },
      testimonials: { title: 'What Our Clients Say' },
      products: { title: 'Featured Products', featured: true }
    };

    addBlock({
      page_slug: selectedPage,
      section_key: `${blockType}_${Date.now()}`,
      block_type: blockType,
      content: defaultContent[blockType] || {},
      order_index: blocks.length,
      is_active: true
    });
    setShowAddBlock(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Page Content Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Select Page</label>
            <Select value={selectedPage} onValueChange={setSelectedPage}>
              <SelectTrigger className="w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_PAGES.map((page) => (
                  <SelectItem key={page.value} value={page.value}>
                    {page.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <p>Loading blocks...</p>
          ) : (
            <>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={blocks.map(block => block.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4">
                    {blocks.map((block, index) => (
                      <SortableBlock
                        key={block.id}
                        block={block}
                        index={index}
                        editingBlockId={editingBlockId}
                        setEditingBlockId={setEditingBlockId}
                        updateBlock={updateBlock}
                        deleteBlock={deleteBlock}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              <div className="mt-6">
                {!showAddBlock ? (
                  <Button onClick={() => setShowAddBlock(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Block
                  </Button>
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-4">Select Block Type</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {Object.entries(BLOCK_TYPE_LABELS).map(([type, label]) => (
                          <Button
                            key={type}
                            variant="outline"
                            onClick={() => handleAddBlock(type as BlockType)}
                          >
                            {label}
                          </Button>
                        ))}
                      </div>
                      <Button
                        variant="ghost"
                        className="mt-4"
                        onClick={() => setShowAddBlock(false)}
                      >
                        Cancel
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PageContentManagement;
