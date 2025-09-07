import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Eye } from 'lucide-react';

interface ViewCounterProps {
  blogPostId: string;
  className?: string;
}

const ViewCounter: React.FC<ViewCounterProps> = ({ blogPostId, className = "" }) => {
  const { data: stats } = useQuery({
    queryKey: ['blog-post-stats', blogPostId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_post_stats')
        .select('total_views')
        .eq('blog_post_id', blogPostId)
        .single();

      if (error) return { total_views: 0 };
      return data;
    }
  });

  const views = stats?.total_views || 0;

  if (views === 0) return null;

  return (
    <div className={`flex items-center space-x-1 text-muted-foreground ${className}`}>
      <Eye size={14} />
      <span className="text-sm">{views.toLocaleString()} views</span>
    </div>
  );
};

export default ViewCounter;