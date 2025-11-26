import React from 'react';
import { FeaturesBlockContent } from '@/types/page-blocks';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface FeaturesBlockProps {
  content: FeaturesBlockContent;
}

const FeaturesBlock: React.FC<FeaturesBlockProps> = ({ content }) => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
          {content.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.items.map((item, index) => {
            const IconComponent = (Icons as any)[item.icon] || Icons.Star;
            return (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <IconComponent className="w-12 h-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBlock;
