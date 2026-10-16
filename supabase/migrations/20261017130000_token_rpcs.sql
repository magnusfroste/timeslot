-- Säkerhetssvep 2026-10-17, steg 1 (redan tillämpad i databasen, påverkar inte befintlig klient).
-- Tabellerna var öppna: vem som helst kunde läsa edit_token/response_token och uppdatera eller
-- radera alla inbjudningar och svar (policyerna hade bara "true"). Klienten går nu via de här
-- funktionerna, som kontrollerar token på serversidan. Steg 2 (20261017130100) stänger tabellerna
-- och ska köras först när den nya klienten är publicerad.

create or replace function public.create_meeting_invite(
  p_title text, p_description text, p_inviter_name text, p_available_slots text[], p_creator_timezone text)
returns setof public.meeting_invites language sql security definer set search_path = public as $$
  insert into public.meeting_invites (title, description, inviter_name, available_slots, creator_timezone)
  values (p_title, p_description, p_inviter_name, coalesce(p_available_slots, '{}'), coalesce(p_creator_timezone, 'UTC'))
  returning *;
$$;

create or replace function public.get_meeting_invite_for_edit(p_invite_id uuid, p_token uuid)
returns setof public.meeting_invites language sql stable security definer set search_path = public as $$
  select * from public.meeting_invites where id = p_invite_id and edit_token = p_token;
$$;

create or replace function public.update_meeting_invite(
  p_invite_id uuid, p_token uuid, p_title text, p_description text, p_inviter_name text, p_available_slots text[])
returns setof public.meeting_invites language sql security definer set search_path = public as $$
  update public.meeting_invites
     set title = p_title, description = p_description, inviter_name = p_inviter_name,
         available_slots = coalesce(p_available_slots, '{}')
   where id = p_invite_id and edit_token = p_token
  returning *;
$$;

create or replace function public.confirm_meeting_slot(p_invite_id uuid, p_token uuid, p_slot text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  update public.meeting_invites set confirmed_slot = p_slot where id = p_invite_id and edit_token = p_token;
  return found;
end $$;

create or replace function public.delete_meeting_invite(p_invite_id uuid, p_token uuid)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  delete from public.meeting_invites where id = p_invite_id and edit_token = p_token;
  return found;
end $$;

create or replace function public.submit_participant_response(
  p_invite_id uuid, p_participant_name text, p_participant_initials text, p_selected_slots text[])
returns setof public.participant_responses language sql security definer set search_path = public as $$
  insert into public.participant_responses (invite_id, participant_name, participant_initials, selected_slots)
  values (p_invite_id, p_participant_name, p_participant_initials, coalesce(p_selected_slots, '{}'))
  returning *;
$$;

create or replace function public.update_participant_response(
  p_response_id uuid, p_token uuid, p_participant_initials text, p_selected_slots text[])
returns setof public.participant_responses language sql security definer set search_path = public as $$
  update public.participant_responses
     set participant_initials = p_participant_initials, selected_slots = coalesce(p_selected_slots, '{}')
   where id = p_response_id and response_token = p_token
  returning *;
$$;

grant execute on function
  public.create_meeting_invite(text, text, text, text[], text),
  public.get_meeting_invite_for_edit(uuid, uuid),
  public.update_meeting_invite(uuid, uuid, text, text, text, text[]),
  public.confirm_meeting_slot(uuid, uuid, text),
  public.delete_meeting_invite(uuid, uuid),
  public.submit_participant_response(uuid, text, text, text[]),
  public.update_participant_response(uuid, uuid, text, text[])
to anon, authenticated;
