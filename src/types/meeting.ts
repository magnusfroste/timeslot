export interface MeetingInvite {
  id: string;
  title: string;
  description: string | null;
  inviter_name: string;
  available_slots: string[];
  created_at: string;
  expires_at: string | null;
}

export interface ParticipantResponse {
  id: string;
  invite_id: string;
  participant_name: string;
  participant_initials: string;
  selected_slots: string[];
  created_at: string;
  updated_at: string;
}
