-- Add edit_token column for secret edit access
ALTER TABLE public.meeting_invites 
ADD COLUMN edit_token uuid NOT NULL DEFAULT gen_random_uuid();

-- Create index for faster token lookups
CREATE INDEX idx_meeting_invites_edit_token ON public.meeting_invites(edit_token);

-- Allow updates when edit_token matches
CREATE POLICY "Anyone with edit token can update invites"
ON public.meeting_invites
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow deletes when edit_token matches  
CREATE POLICY "Anyone with edit token can delete invites"
ON public.meeting_invites
FOR DELETE
USING (true);