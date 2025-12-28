-- Enable realtime for participant_responses table
ALTER TABLE public.participant_responses REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.participant_responses;