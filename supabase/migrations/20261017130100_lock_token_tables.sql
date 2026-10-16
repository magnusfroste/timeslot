-- Säkerhetssvep 2026-10-17, steg 2. KÖRS FÖRST NÄR KLIENTEN SOM ANVÄNDER RPC:erna ÄR PUBLICERAD.
-- Stänger direkt skrivning och gömmer token-kolumnerna. Läsning av övriga kolumner (och realtime
-- på participant_responses) fungerar som förut.
drop policy if exists "Only valid edit token can update invites" on public.meeting_invites;
drop policy if exists "Only valid edit token can delete invites" on public.meeting_invites;
drop policy if exists "Anyone can create meeting invites" on public.meeting_invites;
drop policy if exists "Only token holder can update responses" on public.participant_responses;
drop policy if exists "Anyone can add responses" on public.participant_responses;

revoke insert, update, delete, select on public.meeting_invites from anon, authenticated;
revoke insert, update, delete, select on public.participant_responses from anon, authenticated;
grant select (id, title, description, inviter_name, available_slots, created_at, expires_at, creator_timezone, confirmed_slot)
  on public.meeting_invites to anon, authenticated;
grant select (id, invite_id, participant_name, participant_initials, selected_slots, created_at, updated_at)
  on public.participant_responses to anon, authenticated;
revoke insert, update, delete on public.meeting_invites_public, public.participant_responses_public from anon, authenticated;
