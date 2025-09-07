-- Schedule automatic cleanup of expired cards daily at 2 AM
-- First ensure pg_cron extension is enabled
-- Note: This requires enabling pg_cron extension in your Supabase project

-- Schedule daily cleanup at 2 AM UTC
SELECT cron.schedule(
  'cleanup-expired-cards-daily',
  '0 2 * * *', -- Daily at 2 AM UTC
  $$
  SELECT net.http_post(
      url := 'https://ohfkcxwwvksrjymkgloo.supabase.co/functions/v1/cleanup-expired-cards',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oZmtjeHd3dmtzcmp5bWtnbG9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMDk2MjgsImV4cCI6MjA2NTY4NTYyOH0.c-kSgAyWyiqbJ1m-binRf23l7P-cAT7AEP_sxGYHMpY"}'::jsonb,
      body := '{"scheduled": true}'::jsonb
  ) as request_id;
  $$
);