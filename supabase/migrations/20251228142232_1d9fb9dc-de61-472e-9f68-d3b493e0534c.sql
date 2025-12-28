-- Create meeting_invites table
CREATE TABLE public.meeting_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  inviter_name TEXT NOT NULL,
  available_slots TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- Create participant_responses table
CREATE TABLE public.participant_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invite_id UUID NOT NULL REFERENCES public.meeting_invites(id) ON DELETE CASCADE,
  participant_name TEXT NOT NULL,
  participant_initials TEXT NOT NULL,
  selected_slots TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(invite_id, participant_name)
);

-- Enable RLS
ALTER TABLE public.meeting_invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participant_responses ENABLE ROW LEVEL SECURITY;

-- Meeting invites: public read/insert (anyone with the link can view/create)
CREATE POLICY "Anyone can create meeting invites"
  ON public.meeting_invites FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view meeting invites"
  ON public.meeting_invites FOR SELECT
  TO anon, authenticated
  USING (true);

-- Participant responses: public read/insert/update
CREATE POLICY "Anyone can add responses"
  ON public.participant_responses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view responses"
  ON public.participant_responses FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update responses"
  ON public.participant_responses FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.participant_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Performance indexes
CREATE INDEX idx_responses_invite_id ON public.participant_responses(invite_id);
CREATE INDEX idx_invites_created_at ON public.meeting_invites(created_at DESC);