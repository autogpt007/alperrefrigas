import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { Truck, AlertTriangle, MapPin, Globe, Package, DollarSign, Clock } from 'lucide-react';
import { useShippingZones, getShippingZoneForCountry, calculateShippingCost, type ShippingZone } from '@/hooks/useShippingZones';
import { Badge } from '../ui/badge';

const ShippingCalculator = () => {
  const { data: zones, isLoading: zonesLoading } = useShippingZones();
  const [formData, setFormData] = useState({
    fromZip: '10001', // Default warehouse location
    toZip: '',
    weight: '',
    productType: '',
    country: 'US',
    state: ''
  });
  const [calculatedZone, setCalculatedZone] = useState<ShippingZone | null>(null);
  const [shippingResult, setShippingResult] = useState<{
    shippingCost: number;
    isFreeShipping: boolean;
    transitDays: string;
  } | null>(null);
  const [epaRestrictions, setEpaRestrictions] = useState<string[]>([]);
  const [estimatedSubtotal, setEstimatedSubtotal] = useState<number>(0);

  const calculateShipping = () => {
    if (!zones) return;

    // Find matching zone
    const zone = getShippingZoneForCountry(zones, formData.country, formData.state);
    setCalculatedZone(zone);

    if (zone) {
      // Determine if product is HazMat (refrigerants are)
      const isHazmat = formData.productType !== '' && formData.productType !== 'accessories';
      const result = calculateShippingCost(zone, estimatedSubtotal, isHazmat);
      setShippingResult(result);
    }

    // Set EPA restrictions based on state and product type
    const restrictions = [];
    if (formData.state === 'CA') {
      restrictions.push('California requires additional documentation for HFC refrigerants under CARB regulations');
    }
    if (formData.productType === 'R-22') {
      restrictions.push('R-22 shipments require EPA Section 608 technician certification verification');
    }
    if (formData.productType && formData.productType !== 'accessories') {
      restrictions.push('All refrigerant orders require valid EPA 608 certification');
    }
    if (['DE', 'FR', 'IT', 'ES', 'NL'].includes(formData.country)) {
      restrictions.push('EU shipments require F-Gas certification under EU Regulation 517/2014');
    }
    setEpaRestrictions(restrictions);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Recalculate when form data changes
  useEffect(() => {
    if (formData.country && zones) {
      calculateShipping();
    }
  }, [formData.country, formData.state, formData.productType, estimatedSubtotal, zones]);

  const countryOptions = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'AU', name: 'Australia' },
    { code: 'NZ', name: 'New Zealand' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Shipping Calculator</h1>
        <p className="text-muted-foreground">
          Calculate shipping costs and check EPA/regulatory compliance for refrigerant deliveries worldwide.
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
            <div>
              <label className="block text-sm font-medium mb-2">Destination Country</label>
              <Select 
                value={formData.country} 
                onValueChange={(value) => handleInputChange('country', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map(country => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.country === 'US' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                    <Input
                      placeholder="12345"
                      value={formData.toZip}
                      onChange={(e) => handleInputChange('toZip', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <Select 
                      onValueChange={(value) => handleInputChange('state', value)}
                      value={formData.state}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        <SelectItem value="AK">Alaska</SelectItem>
                        <SelectItem value="HI">Hawaii</SelectItem>
                        <SelectItem value="IL">Illinois</SelectItem>
                        <SelectItem value="PA">Pennsylvania</SelectItem>
                        <SelectItem value="OH">Ohio</SelectItem>
                        <SelectItem value="GA">Georgia</SelectItem>
                        <SelectItem value="NC">North Carolina</SelectItem>
                        <SelectItem value="MI">Michigan</SelectItem>
                        <SelectItem value="NJ">New Jersey</SelectItem>
                        <SelectItem value="VA">Virginia</SelectItem>
                        <SelectItem value="WA">Washington</SelectItem>
                        <SelectItem value="AZ">Arizona</SelectItem>
                        <SelectItem value="MA">Massachusetts</SelectItem>
                        <SelectItem value="TN">Tennessee</SelectItem>
                        <SelectItem value="IN">Indiana</SelectItem>
                        <SelectItem value="MO">Missouri</SelectItem>
                        <SelectItem value="MD">Maryland</SelectItem>
                        <SelectItem value="WI">Wisconsin</SelectItem>
                        <SelectItem value="CO">Colorado</SelectItem>
                        <SelectItem value="MN">Minnesota</SelectItem>
                        <SelectItem value="SC">South Carolina</SelectItem>
                        <SelectItem value="AL">Alabama</SelectItem>
                        <SelectItem value="LA">Louisiana</SelectItem>
                        <SelectItem value="KY">Kentucky</SelectItem>
                        <SelectItem value="OR">Oregon</SelectItem>
                        <SelectItem value="OK">Oklahoma</SelectItem>
                        <SelectItem value="CT">Connecticut</SelectItem>
                        <SelectItem value="UT">Utah</SelectItem>
                        <SelectItem value="IA">Iowa</SelectItem>
                        <SelectItem value="NV">Nevada</SelectItem>
                        <SelectItem value="AR">Arkansas</SelectItem>
                        <SelectItem value="MS">Mississippi</SelectItem>
                        <SelectItem value="KS">Kansas</SelectItem>
                        <SelectItem value="NM">New Mexico</SelectItem>
                        <SelectItem value="NE">Nebraska</SelectItem>
                        <SelectItem value="WV">West Virginia</SelectItem>
                        <SelectItem value="ID">Idaho</SelectItem>
                        <SelectItem value="NH">New Hampshire</SelectItem>
                        <SelectItem value="ME">Maine</SelectItem>
                        <SelectItem value="MT">Montana</SelectItem>
                        <SelectItem value="RI">Rhode Island</SelectItem>
                        <SelectItem value="DE">Delaware</SelectItem>
                        <SelectItem value="SD">South Dakota</SelectItem>
                        <SelectItem value="ND">North Dakota</SelectItem>
                        <SelectItem value="VT">Vermont</SelectItem>
                        <SelectItem value="WY">Wyoming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Product Type</label>
              <Select onValueChange={(value) => handleInputChange('productType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="R-410A">R-410A Refrigerant</SelectItem>
                  <SelectItem value="R-134A">R-134A Refrigerant</SelectItem>
                  <SelectItem value="R-22">R-22 (HCFC) Refrigerant</SelectItem>
                  <SelectItem value="R-32">R-32 Refrigerant</SelectItem>
                  <SelectItem value="R-404A">R-404A Refrigerant</SelectItem>
                  <SelectItem value="R-407C">R-407C Refrigerant</SelectItem>
                  <SelectItem value="accessories">Accessories (Non-Refrigerant)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Estimated Order Value ($)</label>
              <Input
                type="number"
                placeholder="500"
                value={estimatedSubtotal || ''}
                onChange={(e) => setEstimatedSubtotal(parseFloat(e.target.value) || 0)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Enter estimated order value to check free shipping eligibility
              </p>
            </div>

            <Button 
              onClick={calculateShipping} 
              disabled={zonesLoading || !formData.country}
              className="w-full"
            >
              {zonesLoading ? 'Loading...' : 'Calculate Shipping'}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          {/* EPA Compliance Alerts */}
          {epaRestrictions.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Regulatory Compliance Notice:</div>
                <ul className="list-disc list-inside space-y-1">
                  {epaRestrictions.map((restriction, index) => (
                    <li key={index} className="text-sm">{restriction}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Shipping Result */}
          {calculatedZone && shippingResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Rate for {calculatedZone.region_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <DollarSign className="h-4 w-4" />
                      Shipping Cost
                    </div>
                    <div className="text-2xl font-bold">
                      {shippingResult.isFreeShipping ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${shippingResult.shippingCost.toFixed(2)}`
                      )}
                    </div>
                    {shippingResult.isFreeShipping && (
                      <Badge variant="secondary" className="mt-1">
                        Order qualifies for free shipping!
                      </Badge>
                    )}
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Clock className="h-4 w-4" />
                      Estimated Transit
                    </div>
                    <div className="text-2xl font-bold">{shippingResult.transitDays}</div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Rate:</span>
                    <span>${calculatedZone.base_rate.toFixed(2)}</span>
                  </div>
                  {calculatedZone.hazmat_surcharge && formData.productType && formData.productType !== 'accessories' && (
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        HazMat Surcharge:
                      </span>
                      <span>${calculatedZone.hazmat_surcharge.toFixed(2)}</span>
                    </div>
                  )}
                  {calculatedZone.free_shipping_threshold && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Free Shipping Threshold:</span>
                      <span>${calculatedZone.free_shipping_threshold.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Zones Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                International Shipping Zones
              </CardTitle>
              <CardDescription>
                We ship worldwide with competitive rates and compliance support
              </CardDescription>
            </CardHeader>
            <CardContent>
              {zonesLoading ? (
                <p>Loading shipping zones...</p>
              ) : (
                <div className="space-y-3">
                  {zones?.map((zone) => (
                    <div 
                      key={zone.id} 
                      className={`p-3 border rounded-lg ${calculatedZone?.id === zone.id ? 'border-primary bg-primary/5' : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{zone.region_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {zone.transit_days_min}-{zone.transit_days_max} days • 
                            Free shipping over ${zone.free_shipping_threshold}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${zone.base_rate.toFixed(2)}</div>
                          {zone.hazmat_surcharge && (
                            <div className="text-xs text-muted-foreground">
                              +${zone.hazmat_surcharge} HazMat
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Important Shipping Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• All refrigerant shipments require EPA Section 608 technician certification</p>
              <p>• Hazmat shipping regulations apply to all refrigerant products</p>
              <p>• EU shipments require valid F-Gas certification (Reg. 517/2014)</p>
              <p>• Delivery signature required for all orders</p>
              <p>• Alaska & Hawaii may have extended delivery times</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ShippingCalculator;
