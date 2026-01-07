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
      
      const { data, error } = await supabase
        .from('meeting_invites')
        .select('*')
        .eq('id', inviteId)
        .eq('edit_token', editToken)
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
        .from('meeting_invites')
        .update({
          title: params.title,
          description: params.description || null,
          inviter_name: params.inviterName,
          available_slots: params.availableSlots,
        })
        .eq('id', inviteId)
        .eq('edit_token', editToken)
        .select()
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

      const { error } = await supabase
        .from('meeting_invites')
        .delete()
        .eq('id', inviteId)
        .eq('edit_token', editToken);

      if (error) throw new Error("Failed to delete invite");
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

  return {
    invite: inviteQuery.data,
    isLoading: inviteQuery.isLoading,
    isValidToken: inviteQuery.data !== null,
    updateInvite: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    deleteInvite: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
