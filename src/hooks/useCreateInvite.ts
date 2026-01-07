import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { createInviteSchema, type CreateInviteFormData, type TimeSlot } from "@/lib/validations/invite";

function formatTimeSlots(timeSlots: TimeSlot[]): string[] {
  return timeSlots
    .filter(slot => slot.date && slot.time)
    .map(slot => `${slot.date}T${slot.time}:00`);
}

function getLocalTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function useCreateInvite() {
  return useMutation({
    mutationFn: async (params: CreateInviteFormData) => {
      // Validate with zod schema
      const validated = createInviteSchema.parse(params);
      const validSlots = formatTimeSlots(validated.timeSlots);
      const creatorTimezone = getLocalTimezone();

      const { data, error } = await supabase
        .from('meeting_invites')
        .insert({
          title: validated.title,
          description: validated.description,
          inviter_name: validated.inviterName,
          available_slots: validSlots,
          creator_timezone: creatorTimezone
        })
        .select()
        .single();

      if (error) {
        throw new Error("Failed to create invite. Please try again.");
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Meeting invite created!");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });
}

export type { TimeSlot, CreateInviteFormData };
