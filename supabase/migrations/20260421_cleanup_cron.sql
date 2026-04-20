-- =============================================
-- MIGRATION: Nightly Cleanup Cron Job
-- Run in: Supabase SQL Editor
-- Requires: pg_cron and pg_net extensions (enabled by default on Supabase)
-- =============================================

-- Step 1: Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Step 2: Store the service role key securely as a DB setting
-- REPLACE <YOUR_SERVICE_ROLE_KEY> with your actual key (get from Supabase Dashboard > Settings > API)
ALTER DATABASE postgres SET app.service_role_key = '<YOUR_SERVICE_ROLE_KEY>';

-- Step 3: Store Edge Function URL (replace <YOUR_PROJECT_REF>)
ALTER DATABASE postgres SET app.cleanup_function_url = 'https://<YOUR_PROJECT_REF>.supabase.co/functions/v1/cleanup-old-events';

-- Step 4: Schedule nightly at 2:00 AM UTC (7:00 AM PKT)
-- This calls the Edge Function via HTTP POST using pg_net
SELECT cron.schedule(
  'nightly-stale-event-cleanup',
  '0 2 * * *',
  $$
  SELECT net.http_post(
    url       := current_setting('app.cleanup_function_url'),
    headers   := jsonb_build_object(
                  'Content-Type',  'application/json',
                  'Authorization', 'Bearer ' || current_setting('app.service_role_key')
                ),
    body      := '{}'::jsonb,
    timeout_milliseconds := 30000
  ) AS request_id;
  $$
);

-- =============================================
-- MANAGEMENT QUERIES (run anytime to check status):
-- =============================================

-- View all scheduled jobs:
-- SELECT jobid, jobname, schedule, command, active FROM cron.job;

-- View recent run history:
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 10;

-- Delete the cron job if needed:
-- SELECT cron.unschedule('nightly-stale-event-cleanup');
