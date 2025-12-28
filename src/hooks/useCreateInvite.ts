import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TimeSlot {
  date: string;
  time: string;
}

interface CreateInviteParams {
  title: string;
  description: string;
  inviterName: string;
  timeSlots: TimeSlot[];
}

function formatTimeSlots(timeSlots: TimeSlot[]): string[] {
  return timeSlots
    .filter(slot => slot.date && slot.time)
    .map(slot => `${slot.date}T${slot.time}:00`);
}

function validateInvite(params: CreateInviteParams): string | null {
  if (!params.title || !params.inviterName) {
    return "Please fill in the meeting title and your name";
  }
  
  const validSlots = formatTimeSlots(params.timeSlots);
  if (validSlots.length === 0) {
    return "Please add at least one time slot";
  }
  
  return null;
}

export function useCreateInvite() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (params: CreateInviteParams) => {
      const validationError = validateInvite(params);
      if (validationError) {
        throw new Error(validationError);
      }

      const validSlots = formatTimeSlots(params.timeSlots);

      console.log("Creating invite with data:", {
        title: params.title,
        description: params.description,
        inviter_name: params.inviterName,
        available_slots: validSlots
      });

      const { data, error } = await supabase
        .from('meeting_invites')
        .insert({
          title: params.title,
          description: params.description,
          inviter_name: params.inviterName,
          available_slots: validSlots
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating invite:", error);
        throw new Error("Failed to create invite. Please try again.");
      }

      console.log("Created invite:", data);
      return data;
    },
    onSuccess: (data) => {
      toast.success("Meeting invite created successfully!");
      navigate(`/invite/${data.id}`);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}

export type { TimeSlot, CreateInviteParams };
