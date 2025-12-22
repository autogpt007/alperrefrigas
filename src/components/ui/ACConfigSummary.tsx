import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Pencil, Zap, Package, Check } from 'lucide-react';
import { ACConfiguration } from './ACConfigurator';

// Re-export ACConfiguration for convenience
export type { ACConfiguration };

interface ACConfigSummaryProps {
  configuration: ACConfiguration;
  onConfigurationChange?: (config: ACConfiguration) => void;
  editable?: boolean;
  compact?: boolean;
}

export const ACConfigSummary: React.FC<ACConfigSummaryProps> = ({
  configuration,
  onConfigurationChange,
  editable = true,
  compact = true
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [tempConfig, setTempConfig] = useState<ACConfiguration>(configuration);

  const handleSave = () => {
    if (onConfigurationChange) {
      onConfigurationChange(tempConfig);
    }
    setIsEditOpen(false);
  };

  const handleOpenEdit = () => {
    setTempConfig(configuration);
    setIsEditOpen(true);
  };

  const handleAccessoriesMode = (mode: 'without' | 'with') => {
    // When changing mode, we need to update comes_with_list
    // Since we don't have the full product data, we'll keep existing list for 'without'
    // or mark that user wants accessories
    setTempConfig(prev => ({
      ...prev,
      accessories_mode: mode
    }));
  };

  // Build compact summary string
  const summaryParts: string[] = [];
  if (configuration.btu) summaryParts.push(`${configuration.btu.toLocaleString()} BTU`);
  if (configuration.voltage) summaryParts.push(configuration.voltage);
  if (configuration.plug_type) summaryParts.push(configuration.plug_type);
  
  const accessoriesLabel = configuration.accessories_mode === 'with' 
    ? 'With accessories' 
    : 'Unit only';

  const EditModal = () => (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit AC Configuration</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Read-only specs display */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {tempConfig.btu && (
              <div className="bg-muted rounded-md p-2">
                <span className="text-muted-foreground">BTU:</span>
                <span className="ml-2 font-medium">{tempConfig.btu.toLocaleString()}</span>
              </div>
            )}
            {tempConfig.ac_type && (
              <div className="bg-muted rounded-md p-2">
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2 font-medium">{tempConfig.ac_type}</span>
              </div>
            )}
            {tempConfig.voltage && (
              <div className="bg-muted rounded-md p-2">
                <span className="text-muted-foreground">Voltage:</span>
                <span className="ml-2 font-medium">{tempConfig.voltage}</span>
              </div>
            )}
            {tempConfig.plug_type && (
              <div className="bg-muted rounded-md p-2">
                <span className="text-muted-foreground">Plug:</span>
                <span className="ml-2 font-medium">{tempConfig.plug_type}</span>
              </div>
            )}
          </div>

          {/* Accessories Mode Selection - editable */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Accessories Option</Label>
            <RadioGroup
              value={tempConfig.accessories_mode}
              onValueChange={(value) => handleAccessoriesMode(value as 'without' | 'with')}
              className="space-y-2"
            >
              <div className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                tempConfig.accessories_mode === 'without' 
                  ? 'bg-primary/10 border-primary' 
                  : 'bg-background hover:bg-muted/50'
              }`}>
                <RadioGroupItem value="without" id="edit-without" />
                <Label htmlFor="edit-without" className="cursor-pointer flex-1">
                  <span className="font-medium">Unit Only</span>
                  <p className="text-xs text-muted-foreground">Base package</p>
                </Label>
              </div>
              <div className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                tempConfig.accessories_mode === 'with' 
                  ? 'bg-primary/10 border-primary' 
                  : 'bg-background hover:bg-muted/50'
              }`}>
                <RadioGroupItem value="with" id="edit-with" />
                <Label htmlFor="edit-with" className="cursor-pointer flex-1">
                  <span className="font-medium">With Accessories</span>
                  <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Recommended</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Comes With List */}
          {tempConfig.comes_with_list && tempConfig.comes_with_list.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center">
                <Package className="h-4 w-4 mr-2" />
                Package Contents
              </Label>
              <div className="bg-muted/50 rounded-lg border p-3 max-h-40 overflow-y-auto">
                <ul className="space-y-1">
                  {tempConfig.comes_with_list.map((item, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <Check className="h-3.5 w-3.5 text-green-600 mr-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsEditOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (compact) {
    return (
      <div className="mt-2 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs bg-muted/50">
            <Zap className="h-3 w-3 mr-1" />
            {summaryParts.join(' • ')}
          </Badge>
          <Badge 
            variant={configuration.accessories_mode === 'with' ? 'default' : 'secondary'}
            className="text-xs"
          >
            <Package className="h-3 w-3 mr-1" />
            {accessoriesLabel}
          </Badge>
        </div>
        
        {editable && onConfigurationChange && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-primary"
            onClick={handleOpenEdit}
          >
            <Pencil className="h-3 w-3 mr-1" />
            Edit configuration
          </Button>
        )}

        <EditModal />
      </div>
    );
  }

  // Full display mode for checkout review
  return (
    <div className="space-y-3 p-3 bg-muted/30 rounded-lg border">
      <div className="grid grid-cols-2 gap-2 text-sm">
        {configuration.btu && (
          <div>
            <span className="text-muted-foreground">BTU:</span>
            <span className="ml-2 font-medium">{configuration.btu.toLocaleString()}</span>
          </div>
        )}
        {configuration.ac_type && (
          <div>
            <span className="text-muted-foreground">Type:</span>
            <span className="ml-2 font-medium">{configuration.ac_type}</span>
          </div>
        )}
        {configuration.voltage && (
          <div>
            <span className="text-muted-foreground">Voltage:</span>
            <span className="ml-2 font-medium">{configuration.voltage}</span>
          </div>
        )}
        {configuration.plug_type && (
          <div>
            <span className="text-muted-foreground">Plug:</span>
            <span className="ml-2 font-medium">{configuration.plug_type}</span>
          </div>
        )}
        {configuration.frequency && (
          <div>
            <span className="text-muted-foreground">Frequency:</span>
            <span className="ml-2 font-medium">{configuration.frequency}</span>
          </div>
        )}
        {configuration.phase && (
          <div>
            <span className="text-muted-foreground">Phase:</span>
            <span className="ml-2 font-medium">{configuration.phase}</span>
          </div>
        )}
      </div>

      <div className="border-t pt-2">
        <p className="text-sm font-medium mb-1">
          {configuration.accessories_mode === 'with' 
            ? 'Comes With (Unit + Accessories):' 
            : 'Comes With (Unit Only):'}
        </p>
        {configuration.comes_with_list && configuration.comes_with_list.length > 0 ? (
          <ul className="text-sm text-muted-foreground list-disc list-inside">
            {configuration.comes_with_list.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">Standard package contents</p>
        )}
      </div>

      {editable && onConfigurationChange && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={handleOpenEdit}
        >
          <Pencil className="h-4 w-4 mr-2" />
          Edit Configuration
        </Button>
      )}

      <EditModal />
    </div>
  );
};
