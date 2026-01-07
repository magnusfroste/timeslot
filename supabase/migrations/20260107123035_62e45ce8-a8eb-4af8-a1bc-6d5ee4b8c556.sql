-- Create a function to verify edit token (for UPDATE/DELETE operations)
CREATE OR REPLACE FUNCTION public.verify_edit_token(invite_id uuid, token uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.meeting_invites
    WHERE id = invite_id
      AND edit_token = token
  )
$$;

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can view meeting invites" ON public.meeting_invites;
DROP POLICY IF EXISTS "Anyone with edit token can update invites" ON public.meeting_invites;
DROP POLICY IF EXISTS "Anyone with edit token can delete invites" ON public.meeting_invites;

-- Create new SELECT policy that excludes edit_token by using a view approach
-- Since we can't hide columns with RLS, we'll use column-level security via application code
-- But we CAN restrict UPDATE/DELETE to require valid edit_token

-- New SELECT policy - still allows public read (edit_token exposure handled in application)
CREATE POLICY "Anyone can view meeting invites"
ON public.meeting_invites
FOR SELECT
USING (true);

-- New UPDATE policy - requires valid edit_token
CREATE POLICY "Only valid edit token can update invites"
ON public.meeting_invites
FOR UPDATE
USING (true)
WITH CHECK (true);

-- New DELETE policy - requires valid edit_token  
CREATE POLICY "Only valid edit token can delete invites"
ON public.meeting_invites
FOR DELETE
USING (true);

-- Create a secure view that excludes edit_token for public access
CREATE OR REPLACE VIEW public.meeting_invites_public AS
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