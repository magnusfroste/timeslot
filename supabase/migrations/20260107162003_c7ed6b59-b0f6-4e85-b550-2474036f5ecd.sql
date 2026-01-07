-- Add confirmed_slot column to meeting_invites
ALTER TABLE public.meeting_invites
ADD COLUMN confirmed_slot text;

-- Update the public view to include confirmed_slot
DROP VIEW IF EXISTS public.meeting_invites_public;
CREATE VIEW public.meeting_invites_public AS
SELECT 
  id,
  title,
  description,
  inviter_name,
  available_slots,
  creator_timezone,
  created_at,
  expires_at,
  confirmed_slot
FROM public.meeting_invites;