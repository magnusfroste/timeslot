import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { MeetingInvite, ParticipantResponse } from "@/types/meeting";

export function useMeetingInvite(inviteId: string | undefined) {
  const queryClient = useQueryClient();
  const [newResponseIds, setNewResponseIds] = useState<Set<string>>(new Set());
  const initialLoadComplete = useRef(false);

  const inviteQuery = useQuery({
    queryKey: ['invite', inviteId],
    queryFn: async () => {
      if (!inviteId) return null;
      
      // Use the public view to avoid exposing edit_token
      const { data, error } = await supabase
        .from('meeting_invites_public')
        .select('*')
        .eq('id', inviteId)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        ...data,
        available_slots: data.available_slots as string[],
        creator_timezone: data.creator_timezone || 'UTC'
      } as MeetingInvite;
    },
    enabled: !!inviteId,
  });

  const responsesQuery = useQuery({
    queryKey: ['responses', inviteId],
    queryFn: async () => {
      if (!inviteId) return [];
      
      // Use the public view to avoid exposing response_token
      const { data, error } = await supabase
        .from('participant_responses_public')
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

  // Mark initial load complete after first fetch
  useEffect(() => {
    if (responsesQuery.data && !initialLoadComplete.current) {
      initialLoadComplete.current = true;
    }
  }, [responsesQuery.data]);

  // Subscribe to real-time updates for responses
  useEffect(() => {
    if (!inviteId) return;

    const channel = supabase
      .channel(`responses-${inviteId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'participant_responses',
          filter: `invite_id=eq.${inviteId}`
        },
        (payload) => {
          if (initialLoadComplete.current && payload.new) {
            const newId = (payload.new as ParticipantResponse).id;
            setNewResponseIds(prev => new Set(prev).add(newId));
            
            // Clear the "new" indicator after 5 seconds
            setTimeout(() => {
              setNewResponseIds(prev => {
                const updated = new Set(prev);
                updated.delete(newId);
                return updated;
              });
            }, 5000);
          }
          queryClient.invalidateQueries({ queryKey: ['responses', inviteId] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
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

  const isNewResponse = (responseId: string): boolean => {
    return newResponseIds.has(responseId);
  };

  const hasNewResponses = newResponseIds.size > 0;

  return {
    invite: inviteQuery.data,
    isLoading: inviteQuery.isLoading,
    responses: responsesQuery.data || [],
    responsesLoading: responsesQuery.isLoading,
    getSlotParticipants,
    isNewResponse,
    hasNewResponses,
  };
}
