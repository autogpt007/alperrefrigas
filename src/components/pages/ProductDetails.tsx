
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Plus, FileText } from 'lucide-react';
import { useRFQ } from '../../contexts/RFQContext';
import { useToast } from '../../hooks/use-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const { addItem } = useRFQ();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [packaging, setPackaging] = useState('');

  // Mock product data - in real app, this would come from Firestore
  const products = {
    'r410a': {
      id: 'r410a',
      name: 'Refrigerant R-410A',
      description: 'R-410A is a high-efficiency, non-ozone-depleting HFC refrigerant for modern air-conditioning systems. It operates at higher pressures than R-22 and provides excellent energy efficiency in both commercial and residential applications.',
      imageUrl: '/placeholder.svg',
      specSheetUrl: '/spec-sheets/r410a.pdf',
      packaging: ['Pallet (48 cylinders)', 'Container (900 cylinders)', 'Bulk Tank (1000 lbs)'],
      applications: [
        'Residential air conditioning',
        'Commercial HVAC systems',
        'Heat pump applications',
        'New equipment manufacturing'
      ],
      specifications: {
        'Chemical Formula': 'R-32/R-125 (50/50)',
        'Molecular Weight': '72.6 g/mol',
        'Boiling Point': '-48.5°C (-55.3°F)',
        'Critical Temperature': '72.8°C (163°F)',
        'Ozone Depletion Potential': '0',
        'Global Warming Potential': '2088'
      }
    },
    'r134a': {
      id: 'r134a',
      name: 'Refrigerant R-134a',
      description: 'R-134a is a widely used HFC refrigerant for automotive air-conditioning and medium-temperature refrigeration applications. It has zero ozone depletion potential and excellent thermodynamic properties.',
      imageUrl: '/placeholder.svg',
      specSheetUrl: '/spec-sheets/r134a.pdf',
      packaging: ['Pallet (40 cylinders)', 'Container (800 cylinders)', 'Bulk Tank (2000 lbs)'],
      applications: [
        'Automotive air conditioning',
        'Medium temperature refrigeration',
        'Commercial refrigeration',
        'Industrial cooling systems'
      ],
      specifications: {
        'Chemical Formula': 'CF3CH2F',
        'Molecular Weight': '102.0 g/mol',
        'Boiling Point': '-26.3°C (-15.3°F)',
        'Critical Temperature': '101.1°C (214°F)',
        'Ozone Depletion Potential': '0',
        'Global Warming Potential': '1430'
      }
    },
    'r404a': {
      id: 'r404a',
      name: 'Refrigerant R-404A',
      description: 'R-404A is an HFC blend designed for low and medium-temperature commercial refrigeration applications. It provides excellent performance in supermarket refrigeration and cold storage applications.',
      imageUrl: '/placeholder.svg',
      specSheetUrl: '/spec-sheets/r404a.pdf',
      packaging: ['Pallet (45 cylinders)', 'Container (850 cylinders)', 'Bulk Tank (1500 lbs)'],
      applications: [
        'Low temperature refrigeration',
        'Supermarket refrigeration',
        'Cold storage facilities',
        'Ice machines'
      ],
      specifications: {
        'Chemical Formula': 'R-125/R-143a/R-134a (44/52/4)',
        'Molecular Weight': '97.6 g/mol',
        'Boiling Point': '-46.5°C (-51.7°F)',
        'Critical Temperature': '72.1°C (161.8°F)',
        'Ozone Depletion Potential': '0',
        'Global Warming Potential': '3922'
      }
    }
  };

  const product = products[id as keyof typeof products];

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToRFQ = () => {
    if (!packaging) {
      toast({
        title: "Please select packaging",
        description: "You must select a packaging option before adding to quote request.",
        variant: "destructive"
      });
      return;
    }

    addItem({
      productId: product.id,
      productName: product.name,
      quantity,
      packaging,
      imageUrl: product.imageUrl
    });

    toast({
      title: "Added to Quote Request",
      description: `${quantity} ${packaging} of ${product.name} added to your quote request.`
    });

    // Reset form
    setQuantity(1);
    setPackaging('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/products" className="inline-flex items-center text-blue-600 hover:text-blue-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image and Basic Info */}
        <div>
          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg h-96 flex items-center justify-center mb-6">
            <div className="text-6xl font-bold text-blue-600">{product.name.split(' ')[1]}</div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium text-gray-600">{key}:</span>
                    <span className="text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Details and Quote Form */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <Button variant="outline" className="mb-6">
              <Download className="h-4 w-4 mr-2" />
              Download Specification Sheet
            </Button>
          </div>

          {/* Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {product.applications.map((application, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    {application}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Quote Request Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Add to Quote Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Packaging Type
                </label>
                <Select value={packaging} onValueChange={setPackaging}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select packaging option" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.packaging.map((pkg) => (
                      <SelectItem key={pkg} value={pkg}>
                        {pkg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button onClick={handleAddToRFQ} className="w-full bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add to Quote Request
              </Button>

              <div className="text-center">
                <Link to="/rfq">
                  <Button variant="outline" className="w-full">
                    View Quote Request
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
