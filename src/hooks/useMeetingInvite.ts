import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { MeetingInvite, ParticipantResponse } from "@/types/meeting";

export function useMeetingInvite(inviteId: string | undefined) {
  const queryClient = useQueryClient();

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

  // Subscribe to real-time updates for responses
  useEffect(() => {
    if (!inviteId) return;

    const channel = supabase
      .channel(`responses-${inviteId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'participant_responses',
          filter: `invite_id=eq.${inviteId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['responses', inviteId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [inviteId, queryClient]);

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
