UPDATE public.blog_posts
SET body = replace(body, 'alperrefrigas.com', 'alperrefrigerants.com'),
    excerpt = replace(excerpt, 'alperrefrigas.com', 'alperrefrigerants.com'),
    title = replace(title, 'alperrefrigas.com', 'alperrefrigerants.com')
WHERE body ILIKE '%alperrefrigas.com%' OR excerpt ILIKE '%alperrefrigas.com%' OR title ILIKE '%alperrefrigas.com%';

UPDATE public.contact_info
SET value = replace(value, 'alperrefrigas.com', 'alperrefrigerants.com'),
    description = replace(description, 'alperrefrigas.com', 'alperrefrigerants.com')
WHERE value ILIKE '%alperrefrigas.com%' OR description ILIKE '%alperrefrigas.com%';