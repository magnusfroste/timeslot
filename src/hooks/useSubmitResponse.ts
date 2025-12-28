import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SubmitResponseParams {
  inviteId: string;
  participantName: string;
  selectedSlots: string[];
}

function generateInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function useSubmitResponse(inviteId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ participantName, selectedSlots }: Omit<SubmitResponseParams, 'inviteId'>) => {
      if (!inviteId) {
        throw new Error("Invalid invite");
      }
      
      if (!participantName.trim()) {
        throw new Error("Please enter your name");
      }
      
      if (selectedSlots.length === 0) {
        throw new Error("Please select at least one time slot");
      }

      const initials = generateInitials(participantName);

      const { data, error } = await supabase
        .from('participant_responses')
        .upsert({
          invite_id: inviteId,
          participant_name: participantName.trim(),
          participant_initials: initials,
          selected_slots: selectedSlots
        }, {
          onConflict: 'invite_id,participant_name'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Your availability has been recorded!");
      queryClient.invalidateQueries({ queryKey: ['responses', inviteId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}
