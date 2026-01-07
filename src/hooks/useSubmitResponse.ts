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

// Store response tokens in localStorage for secure updates
function storeResponseToken(inviteId: string, participantName: string, responseToken: string) {
  const key = `response_token_${inviteId}_${participantName}`;
  localStorage.setItem(key, responseToken);
}

function getStoredResponseToken(inviteId: string, participantName: string): string | null {
  const key = `response_token_${inviteId}_${participantName}`;
  return localStorage.getItem(key);
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

      const trimmedName = participantName.trim();
      const initials = generateInitials(trimmedName);
      
      // Check if we have a stored response token (for updating existing response)
      const storedToken = getStoredResponseToken(inviteId, trimmedName);
      
      if (storedToken) {
        // Try to update existing response with the stored token
        const { data: existingResponse } = await supabase
          .from('participant_responses')
          .select('id')
          .eq('invite_id', inviteId)
          .eq('participant_name', trimmedName)
          .maybeSingle();
        
        if (existingResponse) {
          // Verify token and update
          const { data: isValid } = await supabase.rpc('verify_response_token', {
            response_id: existingResponse.id,
            token: storedToken
          });
          
          if (isValid) {
            const { data, error } = await supabase
              .from('participant_responses')
              .update({
                selected_slots: selectedSlots,
                participant_initials: initials
              })
              .eq('id', existingResponse.id)
              .eq('response_token', storedToken)
              .select()
              .single();
            
            if (error) throw error;
            return data;
          }
        }
      }
      
      // Check if response already exists with this name (but we don't have the token)
      const { data: existingCheck } = await supabase
        .from('participant_responses')
        .select('id')
        .eq('invite_id', inviteId)
        .eq('participant_name', trimmedName)
        .maybeSingle();
      
      if (existingCheck) {
        throw new Error("A response with this name already exists. Please use a different name.");
      }

      // Insert new response
      const { data, error } = await supabase
        .from('participant_responses')
        .insert({
          invite_id: inviteId,
          participant_name: trimmedName,
          participant_initials: initials,
          selected_slots: selectedSlots
        })
        .select()
        .single();

      if (error) throw error;
      
      // Store the response token for future updates
      if (data.response_token) {
        storeResponseToken(inviteId, trimmedName, data.response_token);
      }
      
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
