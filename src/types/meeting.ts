export interface MeetingInvite {
  id: string;
  title: string;
  description: string | null;
  inviter_name: string;
  available_slots: string[];
  creator_timezone: string;
  created_at: string;
  expires_at: string | null;
  edit_token: string;
}

export interface ParticipantResponse {
  id: string;
  invite_id: string;
  participant_name: string;
  participant_initials: string;
  selected_slots: string[];
  created_at: string;
  updated_at: string;
  response_token?: string; // Only returned on INSERT, used for secure updates
}
