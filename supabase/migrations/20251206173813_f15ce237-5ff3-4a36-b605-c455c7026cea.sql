-- Fix security_audit_log: Restrict INSERT to authenticated users only
-- This prevents anonymous users from flooding the audit log with fake entries

-- Drop the existing overly permissive INSERT policy
DROP POLICY IF EXISTS "insert_audit_log" ON public.security_audit_log;

-- Create a new INSERT policy that requires authentication
-- Service role (used by edge functions) bypasses RLS automatically
CREATE POLICY "authenticated_can_insert_audit_logs"
ON public.security_audit_log
FOR INSERT
TO authenticated
WITH CHECK (true);