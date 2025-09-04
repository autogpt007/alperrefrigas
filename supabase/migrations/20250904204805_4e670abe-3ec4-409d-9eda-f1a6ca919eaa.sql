-- Add accessory products (2 per category)

-- Gauges & Manifolds
INSERT INTO products (
  name, product_type, category, brand, price, description, sku, 
  stock_quantity, availability, thumbnail_url, images, packaging_options
) VALUES 
(
  'Digital Refrigerant Manifold Gauge Set', 
  'accessory', 
  'gauges', 
  'FrigidFlow', 
  299.99, 
  'Professional 4-way digital manifold with Bluetooth connectivity and smartphone app integration. Compatible with all refrigerant types including R-410A, R-134A, R-404A.',
  'DM-4WAY-BT',
  25,
  'in_stock',
  '/api/placeholder/300/200',
  ARRAY['/api/placeholder/300/200', '/api/placeholder/400/300'],
  '["1 Unit", "5 Units", "10 Units"]'::jsonb
),
(
  'Analog Manifold Gauge Set R410A/R134A', 
  'accessory', 
  'gauges', 
  'FrigidFlow', 
  149.99, 
  'Traditional analog 2-way manifold gauge set with color-coded hoses. Precise pressure readings for R-410A and R-134A refrigerants.',
  'AM-2WAY-410A',
  40,
  'in_stock',
  '/api/placeholder/300/200',
  ARRAY['/api/placeholder/300/200', '/api/placeholder/400/300'],
  '["1 Unit", "5 Units", "10 Units"]'::jsonb
);

-- Recovery Equipment
INSERT INTO products (
  name, product_type, category, brand, price, description, sku, 
  stock_quantity, availability, thumbnail_url, images, packaging_options
) VALUES 
(
  'Refrigerant Recovery Machine RG6000', 
  'accessory', 
  'recovery', 
  'FrigidFlow', 
  1299.99, 
  'High-capacity refrigerant recovery unit for all refrigerant types. Features automatic oil drain, filter change indicator, and EPA-compliant recovery rates.',
  'RG-6000-PRO',
  8,
  'in_stock',
  '/api/placeholder/300/200',
  ARRAY['/api/placeholder/300/200', '/api/placeholder/400/300'],
  '["1 Unit", "2 Units", "5 Units"]'::jsonb
),
(
  'Portable Refrigerant Recovery System', 
  'accessory', 
  'recovery', 
  'FrigidFlow', 
  899.99, 
  'Compact and lightweight recovery unit perfect for field service. Single-phase motor, easy transport, handles all common refrigerants.',
  'PRS-FIELD-900',
  12,
  'in_stock',
  '/api/placeholder/300/200',
  ARRAY['/api/placeholder/300/200', '/api/placeholder/400/300'],
  '["1 Unit", "3 Units", "5 Units"]'::jsonb
);

-- Tools & Equipment
INSERT INTO products (
  name, product_type, category, brand, price, description, sku, 
  stock_quantity, availability, thumbnail_url, images, packaging_options
) VALUES 
(
  'Electronic Refrigerant Leak Detector', 
  'accessory', 
  'tools', 
  'FrigidFlow', 
  199.99, 
  'Professional-grade electronic leak detection tool with audible and visual alerts. Detects all halogenated refrigerants down to 0.1 oz/year.',
  'ELD-PRO-HG',
  30,
  'in_stock',
  '/api/placeholder/300/200',
  ARRAY['/api/placeholder/300/200', '/api/placeholder/400/300'],
  '["1 Unit", "5 Units", "10 Units"]'::jsonb
),
(
  'Tubing Cutter Set (1/8" to 2-1/8")', 
  'accessory', 
  'tools', 
  'FrigidFlow', 
  89.99, 
  'Professional copper tubing cutting tools set. Includes multiple sizes from 1/8" to 2-1/8" for all HVAC applications.',
  'TC-SET-PRO',
  50,
  'in_stock',
  '/api/placeholder/300/200',
  ARRAY['/api/placeholder/300/200', '/api/placeholder/400/300'],
  '["1 Set", "3 Sets", "5 Sets"]'::jsonb
);

-- Fittings & Adapters
INSERT INTO products (
  name, product_type, category, brand, price, description, sku, 
  stock_quantity, availability, thumbnail_url, images, packaging_options
) VALUES 
(
  'R410A Service Port Adapters Set', 
  'accessory', 
  'fittings', 
  'FrigidFlow', 
  49.99, 
  'Complete adapter set for different refrigerant systems. Includes adapters for R-410A, R-134A, R-404A service ports.',
  'SPA-410A-SET',
  75,
  'in_stock',
  '/api/placeholder/300/200',
  ARRAY['/api/placeholder/300/200', '/api/placeholder/400/300'],
  '["1 Set", "5 Sets", "10 Sets"]'::jsonb
),
(
  'Quick-Connect Refrigerant Hose Couplers', 
  'accessory', 
  'fittings', 
  'FrigidFlow', 
  79.99, 
  'Professional quick-connect fittings for refrigerant hoses. Leak-proof design, easy one-hand operation.',
  'QC-HOSE-PRO',
  60,
  'in_stock',
  '/api/placeholder/300/200',
  ARRAY['/api/placeholder/300/200', '/api/placeholder/400/300'],
  '["1 Set", "3 Sets", "5 Sets"]'::jsonb
);

-- Safety Equipment
INSERT INTO products (
  name, product_type, category, brand, price, description, sku, 
  stock_quantity, availability, thumbnail_url, images, packaging_options
) VALUES 
(
  'Refrigerant Safety Glasses', 
  'accessory', 
  'safety', 
  'FrigidFlow', 
  29.99, 
  'ANSI-approved safety eyewear specifically designed for refrigerant handling. UV protection and impact resistance.',
  'RSG-ANSI-UV',
  100,
  'in_stock',
  '/api/placeholder/300/200',
  ARRAY['/api/placeholder/300/200', '/api/placeholder/400/300'],
  '["1 Pair", "5 Pairs", "10 Pairs"]'::jsonb
),
(
  'Chemical-Resistant Work Gloves', 
  'accessory', 
  'safety', 
  'FrigidFlow', 
  39.99, 
  'Professional gloves designed for refrigerant handling. Chemical-resistant material with excellent grip and dexterity.',
  'CRG-HVAC-PRO',
  80,
  'in_stock',
  '/api/placeholder/300/200',
  ARRAY['/api/placeholder/300/200', '/api/placeholder/400/300'],
  '["1 Pair", "5 Pairs", "10 Pairs"]'::jsonb
);

-- Valves & Controls
INSERT INTO products (
  name, product_type, category, brand, price, description, sku, 
  stock_quantity, availability, thumbnail_url, images, packaging_options
) VALUES 
(
  'Electronic Expansion Valve (EEV)', 
  'accessory', 
  'valves', 
  'FrigidFlow', 
  189.99, 
  'Programmable electronic expansion valve for modern HVAC systems. Precise refrigerant flow control and energy efficiency.',
  'EEV-PROG-HVAC',
  20,
  'in_stock',
  '/api/placeholder/300/200',
  ARRAY['/api/placeholder/300/200', '/api/placeholder/400/300'],
  '["1 Unit", "3 Units", "5 Units"]'::jsonb
),
(
  'Ball Valve Set (1/4" to 1-1/8")', 
  'accessory', 
  'valves', 
  'FrigidFlow', 
  129.99, 
  'Professional-grade refrigeration ball valves set. Multiple sizes from 1/4" to 1-1/8" for various HVAC applications.',
  'BV-SET-REFRIG',
  35,
  'in_stock',
  '/api/placeholder/300/200',
  ARRAY['/api/placeholder/300/200', '/api/placeholder/400/300'],
  '["1 Set", "3 Sets", "5 Sets"]'::jsonb
);