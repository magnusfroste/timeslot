import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { MeetingInvite, ParticipantResponse } from "@/types/meeting";

export function useMeetingInvite(inviteId: string | undefined) {
  const inviteQuery = useQuery({
    queryKey: ['invite', inviteId],
    queryFn: async () => {
      if (!inviteId) return null;
      
      const { data, error } = await supabase
        .from('meeting_invites')
        .select('*')
        .eq('id', inviteId)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        ...data,
        available_slots: data.available_slots as string[]
      } as MeetingInvite;
    },
    enabled: !!inviteId,
  });

  const responsesQuery = useQuery({
    queryKey: ['responses', inviteId],
    queryFn: async () => {
      if (!inviteId) return [];
      
      const { data, error } = await supabase
        .from('participant_responses')
        .select('*')
        .eq('invite_id', inviteId);
      
      if (error) throw error;
      
      return (data || []).map(response => ({
        ...response,
        selected_slots: response.selected_slots as string[]
      })) as ParticipantResponse[];
    },
    enabled: !!inviteId,
  });

  const getSlotParticipants = (slot: string): ParticipantResponse[] => {
    return (responsesQuery.data || []).filter(response => 
      response.selected_slots.includes(slot)
    );
  };

  return {
    invite: inviteQuery.data,
    isLoading: inviteQuery.isLoading,
    responses: responsesQuery.data || [],
    responsesLoading: responsesQuery.isLoading,
    getSlotParticipants,
  };
}
