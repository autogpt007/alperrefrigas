-- Clean up malformed blog content with mixed markdown/HTML syntax
UPDATE blog_posts 
SET body = CASE
  -- Remove malformed markdown/HTML combinations
  WHEN body ~ '#.*<h[1-6]' THEN 
    regexp_replace(
      regexp_replace(
        regexp_replace(body, '#+\s*<h[1-6][^>]*>', '', 'g'), 
        '#+\s*([^<\n]+)', '<h2>\1</h2>', 'g'
      ),
      '</h[1-6]>\s*#+', '', 'g'
    )
  -- Convert standalone markdown headers to HTML
  WHEN body ~ '^#+\s+' THEN 
    regexp_replace(
      regexp_replace(
        regexp_replace(body, '^###\s+(.+)$', '<h3>\1</h3>', 'gm'),
        '^##\s+(.+)$', '<h2>\1</h2>', 'gm'
      ),
      '^#\s+(.+)$', '<h2>\1</h2>', 'gm'
    )
  ELSE body
END
WHERE body ~ '#' AND (body ~ '<h[1-6]' OR body ~ '^#+\s+');

-- Convert markdown bold and italic to HTML
UPDATE blog_posts 
SET body = regexp_replace(
  regexp_replace(body, '\*\*([^*]+)\*\*', '<strong>\1</strong>', 'g'),
  '\*([^*]+)\*', '<em>\1</em>', 'g'
)
WHERE body ~ '\*+[^*]+\*+';

-- Clean up any remaining malformed content
UPDATE blog_posts 
SET body = regexp_replace(body, '#+\s*$', '', 'gm')
WHERE body ~ '#+\s*$';