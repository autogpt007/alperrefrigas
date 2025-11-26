import React from 'react';
import { VideoBlockContent } from '@/types/page-blocks';

interface VideoBlockProps {
  content: VideoBlockContent;
}

const VideoBlock: React.FC<VideoBlockProps> = ({ content }) => {
  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {content.title && (
            <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
              {content.title}
            </h2>
          )}
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={content.url}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoBlock;
