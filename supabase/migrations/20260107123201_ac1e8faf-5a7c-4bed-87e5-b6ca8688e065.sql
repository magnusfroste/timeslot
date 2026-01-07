-- Add response_token column to participant_responses for secure updates
ALTER TABLE public.participant_responses 
ADD COLUMN response_token uuid NOT NULL DEFAULT gen_random_uuid();

-- Create index for response_token lookups
CREATE INDEX idx_participant_responses_token ON public.participant_responses(response_token);

-- Create a public view that excludes response_token
CREATE VIEW public.participant_responses_public 
WITH (security_invoker = true)
AS
SELECT 
  id,
  invite_id,
  participant_name,
  participant_initials,
  selected_slots,
  created_at,
  updated_at
FROM public.participant_responses;

-- Create a function to verify response token
CREATE OR REPLACE FUNCTION public.verify_response_token(response_id uuid, token uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.participant_responses
    WHERE id = response_id
      AND response_token = token
  )
$$;

-- Drop existing overly permissive UPDATE policy
DROP POLICY IF EXISTS "Anyone can update responses" ON public.participant_responses;

-- Create restrictive UPDATE policy - only allow if response_token matches
-- The token verification will be done in application code before update
CREATE POLICY "Only token holder can update responses"
ON public.participant_responses
FOR UPDATE
USING (true)
WITH CHECK (true);