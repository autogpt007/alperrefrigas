-- SEO Blog Content Optimization Migration
-- This migration standardizes all existing blog posts for better SEO

-- First, let's update all blog posts to have proper content structure
UPDATE blog_posts 
SET body = CASE 
  -- Convert Markdown headers to proper HTML with SEO-friendly classes
  WHEN body LIKE '%# %' OR body LIKE '%## %' OR body LIKE '%### %' THEN
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          REGEXP_REPLACE(
            REGEXP_REPLACE(
              REGEXP_REPLACE(body, 
                '# ([^\n]+)', 
                '<h2 class="text-2xl font-bold text-white mb-4 mt-8">\1</h2>', 
                'g'
              ),
              '## ([^\n]+)', 
              '<h3 class="text-xl font-semibold text-white mb-3 mt-6">\1</h3>', 
              'g'
            ),
            '### ([^\n]+)', 
            '<h4 class="text-lg font-semibold text-gray-200 mb-3 mt-4">\1</h4>', 
            'g'
          ),
          '#### ([^\n]+)', 
          '<h5 class="text-base font-semibold text-gray-300 mb-2 mt-4">\1</h5>', 
          'g'
        ),
        '##### ([^\n]+)', 
        '<h6 class="text-sm font-semibold text-gray-400 mb-2 mt-3">\1</h6>', 
        'g'
      ),
      '\n\n', 
      '</p><p class="text-gray-300 mb-4 leading-relaxed">', 
      'g'
    )
  ELSE body
END,
-- Ensure all posts have proper excerpts for SEO
excerpt = CASE 
  WHEN excerpt IS NULL OR excerpt = '' THEN
    SUBSTRING(REGEXP_REPLACE(body, '<[^>]+>', '', 'g') FROM 1 FOR 160) || '...'
  ELSE excerpt
END,
-- Add relevant tags for refrigerant industry if missing
tags = CASE 
  WHEN tags IS NULL OR array_length(tags, 1) IS NULL THEN
    CASE 
      WHEN LOWER(title || ' ' || body) LIKE '%r-410a%' OR LOWER(title || ' ' || body) LIKE '%r410a%' THEN
        ARRAY['R-410A', 'Refrigerants', 'HVAC']
      WHEN LOWER(title || ' ' || body) LIKE '%r-134a%' OR LOWER(title || ' ' || body) LIKE '%r134a%' THEN
        ARRAY['R-134A', 'Refrigerants', 'Automotive']
      WHEN LOWER(title || ' ' || body) LIKE '%r-22%' OR LOWER(title || ' ' || body) LIKE '%r22%' THEN
        ARRAY['R-22', 'Refrigerants', 'Phase-out']
      WHEN LOWER(title || ' ' || body) LIKE '%epa%' THEN
        ARRAY['EPA', 'Regulations', 'Compliance']
      WHEN LOWER(title || ' ' || body) LIKE '%hvac%' THEN
        ARRAY['HVAC', 'Air Conditioning', 'Cooling Systems']
      ELSE
        ARRAY['Refrigerants', 'Industry News']
    END
  ELSE tags
END,
-- Ensure proper reading time calculation
reading_time = CASE 
  WHEN reading_time IS NULL OR reading_time = 0 THEN
    GREATEST(1, ROUND(array_length(string_to_array(REGEXP_REPLACE(body, '<[^>]+>', '', 'g'), ' '), 1) / 200.0))
  ELSE reading_time
END,
updated_at = now()
WHERE published = true;

-- Add SEO-optimized call-to-action sections to posts that don't have them
UPDATE blog_posts 
SET body = body || 
  '<div class="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-lg p-6 my-8">
    <h3 class="text-xl font-semibold text-white mb-3">Need Professional Refrigerant Solutions?</h3>
    <p class="text-gray-300 mb-4">Contact our expert team for customized refrigerant solutions, bulk pricing, and technical support.</p>
    <a href="/contact" class="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-2 rounded-md font-semibold transition-all duration-300">Get Expert Consultation</a>
  </div>'
WHERE published = true 
  AND body NOT LIKE '%Get Expert Consultation%' 
  AND body NOT LIKE '%contact%';

-- Update specific posts with refrigerant industry content enhancements
UPDATE blog_posts 
SET body = REGEXP_REPLACE(
  body,
  '(R-?410A?|r-?410a?)',
  '<a href="/products/r-410a" class="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/50" title="R-410A Refrigerant - North American Refrigerants">R-410A</a>',
  'gi'
)
WHERE published = true AND (LOWER(body) LIKE '%r410a%' OR LOWER(body) LIKE '%r-410a%');

UPDATE blog_posts 
SET body = REGEXP_REPLACE(
  body,
  '(R-?134A?|r-?134a?)',
  '<a href="/products/r-134a" class="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/50" title="R-134A Refrigerant - North American Refrigerants">R-134A</a>',
  'gi'
)
WHERE published = true AND (LOWER(body) LIKE '%r134a%' OR LOWER(body) LIKE '%r-134a%');

UPDATE blog_posts 
SET body = REGEXP_REPLACE(
  body,
  '(R-?22|r-?22)',
  '<a href="/products/r-22" class="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/50" title="R-22 Refrigerant - North American Refrigerants">R-22</a>',
  'gi'
)
WHERE published = true AND (LOWER(body) LIKE '%r22%' OR LOWER(body) LIKE '%r-22%');

-- Add structured content improvements for better readability and SEO
UPDATE blog_posts 
SET body = REGEXP_REPLACE(
  REGEXP_REPLACE(
    REGEXP_REPLACE(body,
      '<p>([^<]*(?:benefits?|advantages?|features?)[^<]*)</p>',
      '<div class="bg-slate-800/30 border-l-4 border-cyan-500 pl-4 py-3 my-4"><p class="text-gray-300 mb-0">\1</p></div>',
      'gi'
    ),
    '<p>([^<]*(?:important|note|warning|attention)[^<]*)</p>',
    '<div class="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 my-4"><p class="text-yellow-200 mb-0"><strong>Important:</strong> \1</p></div>',
    'gi'
  ),
  '\n\n',
  '</p><p class="text-gray-300 mb-4 leading-relaxed">',
  'g'
)
WHERE published = true;