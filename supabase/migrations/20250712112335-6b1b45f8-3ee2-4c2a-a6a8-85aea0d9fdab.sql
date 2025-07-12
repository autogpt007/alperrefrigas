-- Insert refrigerant products based on the coolmategas.com collection
-- Note: Using placeholder images since we're not copying their images

-- R-410A Refrigerant 25LB
INSERT INTO public.products (name, description, price, category, brand, epa_approved, chemical_formula, packaging, applications, technical_specs, hazard_class, stock_quantity, availability) VALUES
('R-410A Refrigerant 25LB', 'High-performance HFC refrigerant blend for residential and commercial air conditioning systems. EPA Section 608 certified with 99.8% purity guarantee.', 295.95, 'HFC Refrigerants', 'FrigidFlow', true, 'R-32/R-125 (50/50)', '["25 lb cylinder"]', '["Residential A/C", "Commercial HVAC", "Heat Pumps", "New Installations"]', '{"purity": "99.8%", "pressure_25C": "1566 kPa", "boiling_point": "-51.4°C", "ozone_depletion": "0"}', 'A1', 50, 'in_stock'),

-- R-22 Refrigerant 30LB
('R-22 Refrigerant 30LB', 'HCFC refrigerant for existing systems requiring R-22. EPA Section 608 certified for service and maintenance only. Limited availability due to phase-out.', 569.95, 'HCFC Refrigerants', 'FrigidFlow', true, 'CHClF2', '["30 lb cylinder"]', '["Legacy Systems", "Service Only", "Retrofit Applications"]', '{"purity": "99.9%", "pressure_25C": "1058 kPa", "boiling_point": "-40.8°C", "ozone_depletion": "0.055"}', 'A1', 15, 'limited'),

-- R-404A Refrigerant 24LB
('R-404A Refrigerant 24LB', 'HFC blend for medium and low temperature commercial refrigeration. Excellent for supermarket applications and cold storage.', 389.95, 'HFC Refrigerants', 'FrigidFlow', true, 'R-125/R-143a/R-134a', '["24 lb cylinder"]', '["Commercial Refrigeration", "Cold Storage", "Supermarket Systems", "Ice Machines"]', '{"purity": "99.8%", "pressure_25C": "1203 kPa", "boiling_point": "-46.5°C", "gwp": "3922"}', 'A1', 40, 'in_stock'),

-- R-407C Refrigerant 25LB
('R-407C Refrigerant 25LB', 'HFC blend designed as R-22 replacement for air conditioning and heat pump applications. Near-azeotropic blend with excellent performance.', 295.95, 'HFC Refrigerants', 'FrigidFlow', true, 'R-32/R-125/R-134a', '["25 lb cylinder"]', '["A/C Systems", "Heat Pumps", "R-22 Retrofit", "Commercial HVAC"]', '{"purity": "99.8%", "pressure_25C": "1107 kPa", "boiling_point": "-43.8°C", "temperature_glide": "7K"}', 'A1', 35, 'in_stock'),

-- R-134A Refrigerant 30LB
('R-134A Refrigerant 30LB', 'HFC refrigerant for automotive A/C, commercial refrigeration, and centrifugal chillers. Zero ozone depletion potential.', 305.95, 'HFC Refrigerants', 'FrigidFlow', true, 'CH2FCF3', '["30 lb cylinder"]', '["Automotive A/C", "Commercial Refrigeration", "Centrifugal Chillers", "Medium Temperature"]', '{"purity": "99.9%", "pressure_25C": "665 kPa", "boiling_point": "-26.1°C", "ozone_depletion": "0"}', 'A1', 60, 'in_stock'),

-- R-407A Refrigerant 25LB
('R-407A Refrigerant 25LB', 'HFC blend for medium temperature commercial refrigeration. Direct replacement for R-502 with improved efficiency.', 339.95, 'HFC Refrigerants', 'FrigidFlow', true, 'R-32/R-125/R-134a', '["25 lb cylinder"]', '["Medium Temperature Refrigeration", "R-502 Replacement", "Transport Refrigeration"]', '{"purity": "99.8%", "pressure_25C": "1055 kPa", "boiling_point": "-45.2°C", "temperature_glide": "6K"}', 'A1', 25, 'in_stock'),

-- R-422D (MO29) Refrigerant 25LB
('R-422D (MO29) Refrigerant 25LB', 'HFC/HCFC blend for R-22 retrofit applications. Excellent drop-in replacement with minimal system modifications required.', 465.95, 'HFC Refrigerants', 'FrigidFlow', true, 'R-125/R-134a/R-600a', '["25 lb cylinder"]', '["R-22 Retrofit", "Commercial A/C", "Heat Pumps", "Drop-in Replacement"]', '{"purity": "99.8%", "pressure_25C": "1058 kPa", "boiling_point": "-41.1°C", "performance_match": "R-22"}', 'A1', 20, 'in_stock'),

-- R-513A Refrigerant 30LB (Low-GWP)
('R-513A Refrigerant 30LB', 'Next-generation HFO/HFC blend with ultra-low GWP. Ideal for new A/C and heat pump systems seeking environmental compliance.', 549.99, 'Low-GWP Refrigerants', 'FrigidFlow', true, 'R-1234yf/R-134a', '["30 lb cylinder"]', '["New A/C Systems", "Heat Pumps", "Environmental Compliance", "Future-Ready Applications"]', '{"purity": "99.8%", "pressure_25C": "665 kPa", "boiling_point": "-29°C", "gwp": "631"}', 'A1', 30, 'in_stock'),

-- R-427A Refrigerant 25LB
('R-427A Refrigerant 25LB', 'HFC/HFO blend for R-22 replacement with lower GWP. Excellent performance in medium temperature applications.', 519.95, 'HFC Refrigerants', 'FrigidFlow', true, 'R-32/R-125/R-143a/R-1234ze', '["25 lb cylinder"]', '["R-22 Replacement", "Medium Temperature", "Lower GWP Alternative"]', '{"purity": "99.8%", "pressure_25C": "1024 kPa", "boiling_point": "-42.1°C", "gwp": "2138"}', 'A1', 18, 'in_stock'),

-- R-449A Refrigerant 25LB
('R-449A Refrigerant 25LB', 'HFO/HFC blend for R-404A replacement with significantly lower GWP. Excellent for commercial refrigeration retrofit.', 399.95, 'Low-GWP Refrigerants', 'FrigidFlow', true, 'R-32/R-125/R-1234yf/R-134a', '["25 lb cylinder"]', '["R-404A Replacement", "Commercial Refrigeration", "Supermarket Systems", "Lower GWP"]', '{"purity": "99.8%", "pressure_25C": "1280 kPa", "boiling_point": "-45.8°C", "gwp": "1397"}', 'A1', 22, 'in_stock'),

-- Solstice EZ Flush 22LB
('Solstice EZ Flush 22LB', 'HFO-based flush solvent for system cleaning and preparation. Zero ozone depletion, ultra-low GWP environmental solution.', 499.95, 'Specialty Products', 'FrigidFlow', true, 'HFO-1234ze', '["22 lb cylinder"]', '["System Flushing", "Line Cleaning", "Equipment Preparation", "Maintenance"]', '{"purity": "99.9%", "boiling_point": "-19°C", "ozone_depletion": "0", "gwp": "<1"}', 'A2L', 15, 'in_stock'),

-- R-507A Refrigerant 25LB
('R-507A Refrigerant 25LB', 'Azeotropic HFC blend for low temperature commercial refrigeration. Direct replacement for R-502 with superior performance.', 549.95, 'HFC Refrigerants', 'FrigidFlow', true, 'R-125/R-143a (50/50)', '["25 lb cylinder"]', '["Low Temperature Refrigeration", "Frozen Food", "Ice Cream Cabinets", "R-502 Replacement"]', '{"purity": "99.8%", "pressure_25C": "1370 kPa", "boiling_point": "-46.7°C", "azeotropic": "true"}', 'A1', 28, 'in_stock'),

-- R-453A (RS-44B) Refrigerant 25LB
('R-453A (RS-44B) Refrigerant 25LB', 'HFO/HFC blend for R-404A replacement with 55% lower GWP. Optimized for medium temperature commercial refrigeration.', 549.95, 'Low-GWP Refrigerants', 'FrigidFlow', true, 'R-32/R-125/R-1234yf/R-134a/R-227ea', '["25 lb cylinder"]', '["Medium Temperature", "R-404A Replacement", "Commercial Refrigeration", "Display Cases"]', '{"purity": "99.8%", "pressure_25C": "1015 kPa", "boiling_point": "-42.1°C", "gwp": "1765"}', 'A1', 20, 'in_stock'),

-- R-452A Refrigerant 25LB
('R-452A Refrigerant 25LB', 'HFO/HFC blend for R-404A replacement with 55% GWP reduction. Excellent energy efficiency for commercial refrigeration.', 469.95, 'Low-GWP Refrigerants', 'FrigidFlow', true, 'R-32/R-125/R-1234yf', '["25 lb cylinder"]', '["Commercial Refrigeration", "R-404A Retrofit", "Energy Efficiency", "Environmental Compliance"]', '{"purity": "99.8%", "pressure_25C": "1348 kPa", "boiling_point": "-47.1°C", "gwp": "2140"}', 'A1', 25, 'in_stock'),

-- R-448A (N40) Refrigerant 25LB
('R-448A (N40) Refrigerant 25LB', 'HFO/HFC blend for R-404A/R-507A replacement with 65% lower GWP. Optimized for supermarket and cold storage applications.', 369.95, 'Low-GWP Refrigerants', 'FrigidFlow', true, 'R-32/R-125/R-1234yf/R-134a/R-1234ze', '["25 lb cylinder"]', '["Supermarket Systems", "Cold Storage", "R-404A Replacement", "Commercial Refrigeration"]', '{"purity": "99.8%", "pressure_25C": "1273 kPa", "boiling_point": "-45.6°C", "gwp": "1387"}', 'A1', 30, 'in_stock'),

-- R-438A (MO99) Refrigerant 25LB
('R-438A (MO99) Refrigerant 25LB', 'HFC/HCFC blend for R-22 replacement in existing systems. Improved capacity and efficiency over R-407C.', 389.95, 'HFC Refrigerants', 'FrigidFlow', true, 'R-32/R-125/R-134a/R-600a/R-601a', '["25 lb cylinder"]', '["R-22 Replacement", "Existing Systems", "Commercial A/C", "Improved Efficiency"]', '{"purity": "99.8%", "pressure_25C": "1055 kPa", "boiling_point": "-44.4°C", "capacity_improvement": "5-10%"}', 'A1', 22, 'in_stock'),

-- R-422B (NU-22) Refrigerant 25LB
('R-422B (NU-22) Refrigerant 25LB', 'HFC/HCFC blend for R-22 retrofit with excellent capacity match. Minimal system modifications required for conversion.', 395.95, 'HFC Refrigerants', 'FrigidFlow', true, 'R-125/R-134a/R-600a', '["25 lb cylinder"]', '["R-22 Retrofit", "Commercial A/C", "Rooftop Units", "Minimal Modifications"]', '{"purity": "99.8%", "pressure_25C": "1058 kPa", "boiling_point": "-40.8°C", "capacity_match": "R-22"}', 'A1', 18, 'in_stock'),

-- R-421A Refrigerant 25LB
('R-421A Refrigerant 25LB', 'HFC/HCFC blend for R-22 replacement in commercial air conditioning. Excellent performance in existing systems.', 425.95, 'HFC Refrigerants', 'FrigidFlow', true, 'R-125/R-134a', '["25 lb cylinder"]', '["Commercial A/C", "R-22 Replacement", "Existing Systems", "Rooftop Units"]', '{"purity": "99.8%", "pressure_25C": "910 kPa", "boiling_point": "-37.1°C", "retrofit_friendly": "true"}', 'A1', 16, 'in_stock');