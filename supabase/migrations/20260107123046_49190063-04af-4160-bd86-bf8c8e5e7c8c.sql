-- Drop the security definer view and recreate with SECURITY INVOKER
DROP VIEW IF EXISTS public.meeting_invites_public;

CREATE VIEW public.meeting_invites_public 
WITH (security_invoker = true)
AS
SELECT 
  id,
  title,
  description,
  inviter_name,
  available_slots,
  created_at,
  expires_at,
  creator_timezone
FROM public.meeting_invites;