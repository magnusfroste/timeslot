import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { MeetingInvite } from "@/types/meeting";

export function useEditInvite(inviteId: string | undefined, editToken: string | undefined) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const inviteQuery = useQuery({
    queryKey: ['invite-edit', inviteId, editToken],
    queryFn: async () => {
      if (!inviteId || !editToken) return null;
      
      // Token kontrolleras på serversidan
      const { data, error } = await supabase
        .rpc('get_meeting_invite_for_edit', { p_invite_id: inviteId, p_token: editToken })
        .maybeSingle();
      
      if (error) throw error;
      if (!data) return null;
      
      return {
        ...data,
        available_slots: data.available_slots as string[],
        creator_timezone: data.creator_timezone || 'UTC'
      } as MeetingInvite;
    },
    enabled: !!inviteId && !!editToken,
  });

  const updateMutation = useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      inviterName: string;
      availableSlots: string[];
    }) => {
      if (!inviteId || !editToken) throw new Error("Missing invite ID or edit token");

      const { data, error } = await supabase
        .rpc('update_meeting_invite', {
          p_invite_id: inviteId,
          p_token: editToken,
          p_title: params.title,
          p_description: params.description || null,
          p_inviter_name: params.inviterName,
          p_available_slots: params.availableSlots,
        })
        .single();

      if (error) throw new Error("Failed to update invite");
      return data;
    },
    onSuccess: () => {
      toast.success("Meeting invite updated!");
      queryClient.invalidateQueries({ queryKey: ['invite', inviteId] });
      queryClient.invalidateQueries({ queryKey: ['invite-edit', inviteId, editToken] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!inviteId || !editToken) throw new Error("Missing invite ID or edit token");

      const { data: deleted, error } = await supabase
        .rpc('delete_meeting_invite', { p_invite_id: inviteId, p_token: editToken });

      if (error || !deleted) throw new Error("Failed to delete invite");
    },
    onSuccess: () => {
      toast.success("Meeting invite deleted!");
      queryClient.invalidateQueries({ queryKey: ['invite', inviteId] });
      navigate('/');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  const confirmSlotMutation = useMutation({
    mutationFn: async (slot: string | null) => {
      if (!inviteId || !editToken) throw new Error("Missing invite ID or edit token");

      const { data: confirmed, error } = await supabase
        .rpc('confirm_meeting_slot', { p_invite_id: inviteId, p_token: editToken, p_slot: slot });

      if (error || !confirmed) throw new Error("Failed to confirm time slot");
    },
    onSuccess: (_, slot) => {
      if (slot) {
        toast.success("Time slot confirmed!");
      } else {
        toast.success("Confirmation cleared");
      }
      queryClient.invalidateQueries({ queryKey: ['invite', inviteId] });
      queryClient.invalidateQueries({ queryKey: ['invite-edit', inviteId, editToken] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

  return {
    invite: inviteQuery.data,
    isLoading: inviteQuery.isLoading,
    isValidToken: inviteQuery.data !== null,
    updateInvite: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteInvite: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    confirmSlot: confirmSlotMutation.mutate,
    isConfirmingSlot: confirmSlotMutation.isPending,
  };
}
