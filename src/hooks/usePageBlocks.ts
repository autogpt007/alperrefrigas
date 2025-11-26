import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { PageBlock } from '@/types/page-blocks';
import { toast } from 'sonner';

export const usePageBlocks = (pageSlug: string) => {
  const queryClient = useQueryClient();

  const { data: blocks, isLoading } = useQuery({
    queryKey: ['page-blocks', pageSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('page_content_blocks')
        .select('*')
        .eq('page_slug', pageSlug)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (error) throw error;
      return data as PageBlock[];
    }
  });

  const updateBlockMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: any }) => {
      const { error } = await supabase
        .from('page_content_blocks')
        .update({ content })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-blocks', pageSlug] });
      toast.success('Block updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update block: ' + error.message);
    }
  });

  const reorderBlocksMutation = useMutation({
    mutationFn: async (blocks: Array<{ id: string; order_index: number }>) => {
      const updates = blocks.map(({ id, order_index }) =>
        supabase
          .from('page_content_blocks')
          .update({ order_index })
          .eq('id', id)
      );

      const results = await Promise.all(updates);
      const errors = results.filter(r => r.error);
      if (errors.length > 0) throw errors[0].error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-blocks', pageSlug] });
      toast.success('Block order updated');
    },
    onError: (error) => {
      toast.error('Failed to reorder blocks: ' + error.message);
    }
  });

  const deleteBlockMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('page_content_blocks')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-blocks', pageSlug] });
      toast.success('Block removed');
    },
    onError: (error) => {
      toast.error('Failed to remove block: ' + error.message);
    }
  });

  const addBlockMutation = useMutation({
    mutationFn: async (block: Omit<PageBlock, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase
        .from('page_content_blocks')
        .insert(block);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['page-blocks', pageSlug] });
      toast.success('Block added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add block: ' + error.message);
    }
  });

  return {
    blocks: blocks || [],
    isLoading,
    updateBlock: updateBlockMutation.mutate,
    reorderBlocks: reorderBlocksMutation.mutate,
    deleteBlock: deleteBlockMutation.mutate,
    addBlock: addBlockMutation.mutate
  };
};
