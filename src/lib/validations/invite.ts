import { z } from "zod";

const timeSlotSchema = z.object({
  date: z.string(),
  time: z.string(),
});

export const createInviteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Meeting title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .default(""),
  inviterName: z
    .string()
    .trim()
    .min(1, "Your name is required")
    .max(50, "Name must be less than 50 characters"),
  timeSlots: z
    .array(timeSlotSchema)
    .min(1, "At least one time slot is required")
    .refine(
      (slots) => slots.some(slot => slot.date && slot.time),
      "At least one complete time slot (date and time) is required"
    ),
});

export type CreateInviteFormData = z.infer<typeof createInviteSchema>;
export type TimeSlot = z.infer<typeof timeSlotSchema>;
