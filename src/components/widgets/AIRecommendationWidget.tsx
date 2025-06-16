
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lightbulb, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Recommendation {
  refrigerant: string;
  reason: string;
  applications: string[];
  gwp: number;
  epaStatus: string;
  standards: string[];
}

const AIRecommendationWidget = () => {
  const [useCase, setUseCase] = useState('');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    if (!useCase.trim()) {
      toast({
        title: "Please describe your use case",
        description: "Tell us about your HVAC system or application",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockRecommendations: Recommendation[] = [
        {
          refrigerant: 'R-410A',
          reason: 'Optimal for residential and light commercial air conditioning systems with excellent energy efficiency.',
          applications: ['Residential AC', 'Heat Pumps', 'Light Commercial'],
          gwp: 2088,
          epaStatus: 'Approved',
          standards: ['ASHRAE 34', 'UL 2182']
        },
        {
          refrigerant: 'R-32',
          reason: 'Lower GWP alternative with superior thermodynamic properties for modern systems.',
          applications: ['VRF Systems', 'Mini-Splits', 'Commercial AC'],
          gwp: 675,
          epaStatus: 'Approved',
          standards: ['ASHRAE 34', 'ISO 817']
        },
        {
          refrigerant: 'R-454B',
          reason: 'Next-generation low-GWP refrigerant perfect for future-proofing installations.',
          applications: ['Commercial HVAC', 'Chillers', 'Heat Pumps'],
          gwp: 466,
          epaStatus: 'Approved',
          standards: ['ASHRAE 34', 'UL 2182', 'AHRI 700']
        }
      ];

      setRecommendations(mockRecommendations);
      setIsLoading(false);
      
      toast({
        title: "Recommendations Generated",
        description: "AI has analyzed your use case and provided optimal refrigerant suggestions",
      });
    }, 2000);
  };

  const getGWPBadgeColor = (gwp: number) => {
    if (gwp < 750) return 'bg-green-500';
    if (gwp < 1500) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          AI Refrigerant Advisor
        </CardTitle>
        <p className="text-sm text-gray-600">
          Describe your HVAC application and get personalized refrigerant recommendations
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Textarea
            placeholder="Example: I need a refrigerant for a 5-ton commercial rooftop unit in California. The system will be used for office cooling and needs to meet the latest environmental regulations..."
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            rows={4}
            className="w-full"
          />
        </div>
        
        <Button 
          onClick={handleGetRecommendations}
          disabled={isLoading || !useCase.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Get AI Recommendations'
          )}
        </Button>

        {recommendations.length > 0 && (
          <div className="space-y-4 mt-6">
            <h3 className="font-semibold text-lg">Recommended Refrigerants:</h3>
            {recommendations.map((rec, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg text-blue-600">{rec.refrigerant}</h4>
                    <div className="flex gap-2">
                      <Badge className={`${getGWPBadgeColor(rec.gwp)} text-white`}>
                        GWP: {rec.gwp}
                      </Badge>
                      <Badge className="bg-green-500 text-white">
                        {rec.epaStatus}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{rec.reason}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Applications:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {rec.applications.map((app, i) => (
                          <li key={i} className="text-gray-600">{app}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <strong>Standards & Certifications:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {rec.standards.map((standard, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {standard}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" className="flex-1">
                      View Product Details
                    </Button>
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      SDS
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <div className="text-xs text-gray-500 mt-4 p-3 bg-gray-50 rounded">
              <strong>Disclaimer:</strong> These recommendations are based on general industry best practices and the information provided. 
              Always consult with a certified HVAC professional and verify local regulations before making final refrigerant selections. 
              Environmental regulations may vary by location.
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendationWidget;
