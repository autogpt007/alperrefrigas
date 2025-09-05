import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, RefreshCw, CheckCircle } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { generateSitemap, generateSitemapXML, generateRobotsTxt } from '@/utils/sitemapGenerator';
import { useToast } from '@/hooks/use-toast';

const SitemapGenerator: React.FC = () => {
  const { products } = useProducts();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  const handleGenerateSitemap = async () => {
    setIsGenerating(true);
    try {
      // Generate sitemap entries
      const sitemapEntries = generateSitemap(products);
      const sitemapXML = generateSitemapXML(sitemapEntries);
      const robotsTxt = generateRobotsTxt();

      // Create downloadable files
      const sitemapBlob = new Blob([sitemapXML], { type: 'text/xml' });
      const robotsBlob = new Blob([robotsTxt], { type: 'text/plain' });

      // Create download links
      const sitemapUrl = URL.createObjectURL(sitemapBlob);
      const robotsUrl = URL.createObjectURL(robotsBlob);

      // Download sitemap.xml
      const sitemapLink = document.createElement('a');
      sitemapLink.href = sitemapUrl;
      sitemapLink.download = 'sitemap.xml';
      document.body.appendChild(sitemapLink);
      sitemapLink.click();
      document.body.removeChild(sitemapLink);

      // Download robots.txt
      const robotsLink = document.createElement('a');
      robotsLink.href = robotsUrl;
      robotsLink.download = 'robots.txt';
      document.body.appendChild(robotsLink);
      robotsLink.click();
      document.body.removeChild(robotsLink);

      // Cleanup
      URL.revokeObjectURL(sitemapUrl);
      URL.revokeObjectURL(robotsUrl);

      setLastGenerated(new Date());
      toast({
        title: "Sitemap Generated Successfully",
        description: `Generated sitemap with ${sitemapEntries.length} URLs including ${products.length} product pages.`,
      });
    } catch (error) {
      console.error('Error generating sitemap:', error);
      toast({
        title: "Error",
        description: "Failed to generate sitemap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const sitemapEntries = generateSitemap(products);
  const productPages = sitemapEntries.filter(entry => entry.url.includes('/products/') && !entry.url.includes('/category/'));
  const staticPages = sitemapEntries.filter(entry => !entry.url.includes('/products/') || entry.url.includes('/category/'));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Dynamic Sitemap Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{sitemapEntries.length}</div>
              <div className="text-sm text-gray-600">Total URLs</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{productPages.length}</div>
              <div className="text-sm text-gray-600">Product Pages</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{staticPages.length}</div>
              <div className="text-sm text-gray-600">Static Pages</div>
            </div>
          </div>

          {lastGenerated && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">
                Last generated: {lastGenerated.toLocaleString()}
              </span>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold">Features:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Dynamic product URL generation with SEO-friendly slugs</li>
              <li>• Enhanced robots.txt with AI crawler support (GPTBot, OpenAI-SearchBot, etc.)</li>
              <li>• Individual product pages with priority optimization</li>
              <li>• Category and static page indexing</li>
              <li>• Proper lastmod dates and change frequencies</li>
              <li>• Search engine and AI crawler friendly format</li>
            </ul>
          </div>

          <Button 
            onClick={handleGenerateSitemap}
            disabled={isGenerating}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate & Download Sitemap + Robots.txt'}
          </Button>

          <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg">
            <strong>Important:</strong> After downloading, upload the generated sitemap.xml and robots.txt files to your website's public folder to replace the existing ones. Then submit the new sitemap to Google Search Console and Bing Webmaster Tools.
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sitemap Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Product Pages ({productPages.length}):</h4>
              <div className="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded text-xs">
                {productPages.slice(0, 10).map((entry, index) => (
                  <div key={index} className="text-gray-600">
                    {entry.url} (Priority: {entry.priority})
                  </div>
                ))}
                {productPages.length > 10 && (
                  <div className="text-gray-400 italic">... and {productPages.length - 10} more product pages</div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Static & Category Pages ({staticPages.length}):</h4>
              <div className="max-h-40 overflow-y-auto bg-gray-50 p-3 rounded text-xs">
                {staticPages.map((entry, index) => (
                  <div key={index} className="text-gray-600">
                    {entry.url} (Priority: {entry.priority})
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SitemapGenerator;