
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Truck, AlertTriangle, MapPin } from 'lucide-react';

interface ShippingRate {
  carrier: string;
  service: string;
  price: number;
  estimatedDays: string;
  restrictions?: string[];
}

const ShippingCalculator = () => {
  const [formData, setFormData] = useState({
    fromZip: '',
    toZip: '',
    weight: '',
    productType: '',
    state: ''
  });
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [epaRestrictions, setEpaRestrictions] = useState<string[]>([]);

  const calculateShipping = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock shipping rates
    const mockRates: ShippingRate[] = [
      {
        carrier: 'UPS',
        service: 'Ground',
        price: 45.99,
        estimatedDays: '3-5 business days'
      },
      {
        carrier: 'FedEx',
        service: 'Express',
        price: 89.99,
        estimatedDays: '1-2 business days'
      },
      {
        carrier: 'USPS',
        service: 'Priority',
        price: 52.99,
        estimatedDays: '2-3 business days'
      }
    ];

    // Mock EPA restrictions based on state
    const restrictions = [];
    if (formData.state === 'CA') {
      restrictions.push('California requires additional documentation for HFC refrigerants');
    }
    if (formData.productType === 'R-22') {
      restrictions.push('R-22 shipments require EPA technician certification verification');
    }

    setShippingRates(mockRates);
    setEpaRestrictions(restrictions);
    setLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Shipping Calculator</h1>
        <p className="text-gray-600">
          Calculate shipping costs and check EPA compliance for refrigerant deliveries across North America.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shipping Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Details
            </CardTitle>
            <CardDescription>
              Enter your shipping information to calculate rates and check compliance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">From ZIP Code</label>
                <Input
                  placeholder="12345"
                  value={formData.fromZip}
                  onChange={(e) => handleInputChange('fromZip', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">To ZIP Code</label>
                <Input
                  placeholder="54321"
                  value={formData.toZip}
                  onChange={(e) => handleInputChange('toZip', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Destination State</label>
              <Select onValueChange={(value) => handleInputChange('state', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CA">California</SelectItem>
                  <SelectItem value="TX">Texas</SelectItem>
                  <SelectItem value="FL">Florida</SelectItem>
                  <SelectItem value="NY">New York</SelectItem>
                  <SelectItem value="ON">Ontario, Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Product Type</label>
              <Select onValueChange={(value) => handleInputChange('productType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select refrigerant type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="R-410A">R-410A</SelectItem>
                  <SelectItem value="R-134A">R-134A</SelectItem>
                  <SelectItem value="R-22">R-22 (HCFC)</SelectItem>
                  <SelectItem value="R-32">R-32</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Weight (lbs)</label>
              <Input
                type="number"
                placeholder="25"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
              />
            </div>

            <Button 
              onClick={calculateShipping} 
              disabled={loading || !formData.fromZip || !formData.toZip}
              className="w-full"
            >
              {loading ? 'Calculating...' : 'Calculate Shipping'}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {/* EPA Compliance Alerts */}
          {epaRestrictions.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">EPA Compliance Notice:</div>
                <ul className="list-disc list-inside space-y-1">
                  {epaRestrictions.map((restriction, index) => (
                    <li key={index} className="text-sm">{restriction}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Shipping Rates */}
          {shippingRates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {shippingRates.map((rate, index) => (
                    <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{rate.carrier} {rate.service}</div>
                        <div className="text-sm text-gray-500">{rate.estimatedDays}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${rate.price}</div>
                        <Button size="sm">Select</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Important Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• All refrigerant shipments require EPA technician certification</p>
              <p>• Hazmat shipping regulations apply to all refrigerant products</p>
              <p>• Some states have additional restrictions on certain refrigerant types</p>
              <p>• Delivery signature required for all orders</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShippingCalculator;
