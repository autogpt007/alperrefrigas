import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Settings, Package, Check, Info } from 'lucide-react';
import { Product } from '@/contexts/ProductsContext';

export interface ACConfiguration {
  btu: number | undefined;
  ac_type: string;
  voltage: string;
  plug_type: string;
  frequency: string;
  phase: string;
  accessories_mode: 'without' | 'with';
  selected_accessory_ids: string[];
  comes_with_list: string[];
}

interface ACConfiguratorProps {
  product: Product;
  configuration: ACConfiguration;
  onConfigurationChange: (config: ACConfiguration) => void;
}

// Optional add-on accessories (mock data - can be expanded)
const OPTIONAL_ADDONS = [
  { id: 'surge', name: 'Surge Protector', description: 'Protects against power surges' },
  { id: 'cover', name: 'Outdoor Unit Cover', description: 'Weather protection' },
  { id: 'lineset', name: 'Extra Line Set (25ft)', description: 'Extended installation distance' },
  { id: 'pump', name: 'Condensate Pump', description: 'For difficult drainage situations' },
  { id: 'thermostat', name: 'Smart Thermostat', description: 'WiFi-enabled temperature control' },
  { id: 'filter', name: 'Extra Filter Set (3-pack)', description: 'Replacement filters' }
];

export function getDefaultConfiguration(product: Product): ACConfiguration {
  return {
    btu: product.btu,
    ac_type: product.ac_type || '',
    voltage: product.voltage || '',
    plug_type: product.plug_type || '',
    frequency: product.frequency || '',
    phase: product.phase || '1-Phase',
    accessories_mode: 'without',
    selected_accessory_ids: [],
    comes_with_list: product.comes_with_base || []
  };
}

export function formatConfigurationSummary(config: ACConfiguration): string {
  const parts: string[] = [];
  if (config.btu) parts.push(`${config.btu.toLocaleString()} BTU`);
  if (config.voltage) parts.push(config.voltage);
  if (config.plug_type) parts.push(config.plug_type.split(' ')[0]);
  parts.push(config.accessories_mode === 'with' ? 'With accessories' : 'Unit only');
  return parts.join(' • ');
}

const ACConfigurator: React.FC<ACConfiguratorProps> = ({
  product,
  configuration,
  onConfigurationChange
}) => {
  // Update comes_with_list when accessories_mode changes
  useEffect(() => {
    const baseItems = product.comes_with_base || [];
    const accessoryItems = product.comes_with_accessories || [];
    
    const comesWith = configuration.accessories_mode === 'with'
      ? [...baseItems, ...accessoryItems]
      : baseItems;
    
    if (JSON.stringify(comesWith) !== JSON.stringify(configuration.comes_with_list)) {
      onConfigurationChange({
        ...configuration,
        comes_with_list: comesWith
      });
    }
  }, [configuration.accessories_mode, product.comes_with_base, product.comes_with_accessories]);

  const handleAccessoriesMode = (mode: 'without' | 'with') => {
    onConfigurationChange({
      ...configuration,
      accessories_mode: mode
    });
  };

  const handleAddonToggle = (addonId: string) => {
    const current = configuration.selected_accessory_ids || [];
    const updated = current.includes(addonId)
      ? current.filter(id => id !== addonId)
      : [...current, addonId];
    
    onConfigurationChange({
      ...configuration,
      selected_accessory_ids: updated
    });
  };

  const hasElectricalOptions = product.voltage || product.plug_type || product.frequency || product.phase;

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <Settings className="h-5 w-5 mr-2 text-primary" />
          Configure Your Unit
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Product Variant Display */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {product.btu && (
            <div className="bg-background/80 rounded-md p-2 border">
              <span className="text-muted-foreground">BTU:</span>
              <span className="ml-2 font-medium">{product.btu.toLocaleString()}</span>
            </div>
          )}
          {product.ac_type && (
            <div className="bg-background/80 rounded-md p-2 border">
              <span className="text-muted-foreground">Type:</span>
              <span className="ml-2 font-medium">{product.ac_type}</span>
            </div>
          )}
        </div>

        {/* Electrical Details */}
        {hasElectricalOptions && (
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">Electrical Specifications</Label>
            <div className="grid grid-cols-2 gap-3">
              {product.voltage && (
                <div className="bg-background/80 rounded-md p-2 border">
                  <span className="text-muted-foreground text-xs">Voltage:</span>
                  <p className="font-medium text-sm">{product.voltage}</p>
                </div>
              )}
              {product.plug_type && (
                <div className="bg-background/80 rounded-md p-2 border">
                  <span className="text-muted-foreground text-xs">Plug Type:</span>
                  <p className="font-medium text-sm">{product.plug_type}</p>
                </div>
              )}
              {product.frequency && (
                <div className="bg-background/80 rounded-md p-2 border">
                  <span className="text-muted-foreground text-xs">Frequency:</span>
                  <p className="font-medium text-sm">{product.frequency}</p>
                </div>
              )}
              {product.phase && (
                <div className="bg-background/80 rounded-md p-2 border">
                  <span className="text-muted-foreground text-xs">Phase:</span>
                  <p className="font-medium text-sm">{product.phase}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Accessories Mode Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-foreground">Accessories Option</Label>
          <RadioGroup
            value={configuration.accessories_mode}
            onValueChange={(value) => handleAccessoriesMode(value as 'without' | 'with')}
            className="space-y-2"
          >
            <div className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              configuration.accessories_mode === 'without' 
                ? 'bg-primary/10 border-primary' 
                : 'bg-background hover:bg-muted/50'
            }`}>
              <RadioGroupItem value="without" id="without" />
              <Label htmlFor="without" className="cursor-pointer flex-1">
                <span className="font-medium">Unit Only</span>
                <p className="text-xs text-muted-foreground">Base package with essential items</p>
              </Label>
            </div>
            <div className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              configuration.accessories_mode === 'with' 
                ? 'bg-primary/10 border-primary' 
                : 'bg-background hover:bg-muted/50'
            }`}>
              <RadioGroupItem value="with" id="with" />
              <Label htmlFor="with" className="cursor-pointer flex-1">
                <span className="font-medium">With Accessories</span>
                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Recommended</span>
                <p className="text-xs text-muted-foreground">Complete installation package</p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Comes With List */}
        {configuration.comes_with_list.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Comes With (Per Unit)
            </Label>
            <div className="bg-background rounded-lg border p-3">
              <ul className="grid grid-cols-1 gap-1.5">
                {configuration.comes_with_list.map((item, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <Check className="h-3.5 w-3.5 text-green-600 mr-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Optional Add-ons */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground flex items-center">
            <Info className="h-4 w-4 mr-2" />
            Optional Add-ons
            <span className="text-xs text-muted-foreground ml-2">(Quote-based)</span>
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {OPTIONAL_ADDONS.slice(0, 6).map((addon) => (
              <div
                key={addon.id}
                className={`flex items-start space-x-2 p-2 rounded-md border cursor-pointer transition-colors ${
                  configuration.selected_accessory_ids?.includes(addon.id)
                    ? 'bg-primary/10 border-primary'
                    : 'bg-background hover:bg-muted/50'
                }`}
                onClick={() => handleAddonToggle(addon.id)}
              >
                <Checkbox
                  checked={configuration.selected_accessory_ids?.includes(addon.id) || false}
                  onCheckedChange={() => handleAddonToggle(addon.id)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{addon.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{addon.description}</p>
                </div>
              </div>
            ))}
          </div>
          {configuration.selected_accessory_ids?.length > 0 && (
            <p className="text-xs text-muted-foreground italic">
              Selected add-ons will be quoted separately during order processing.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ACConfigurator;
