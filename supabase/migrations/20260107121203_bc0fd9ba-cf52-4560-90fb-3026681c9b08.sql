-- Add creator_timezone column to store the organizer's timezone
ALTER TABLE public.meeting_invites 
ADD COLUMN creator_timezone text NOT NULL DEFAULT 'UTC';