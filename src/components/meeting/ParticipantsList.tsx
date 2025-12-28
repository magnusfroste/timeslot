import { Users } from "lucide-react";
import type { ParticipantResponse } from "@/types/meeting";

interface ParticipantsListProps {
  responses: ParticipantResponse[];
}

export function ParticipantsList({ responses }: ParticipantsListProps) {
  if (responses.length === 0) return null;

  return (
    <div className="mt-8 glass-strong rounded-3xl p-6 shadow-glass">
      <div className="flex items-center gap-2 mb-5">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Participants ({responses.length})
        </h2>
      </div>
      <div className="flex flex-wrap gap-3">
        {responses.map((response, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-background/50 border border-border/50 p-3 rounded-2xl hover-lift"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
              {response.participant_initials}
            </div>
            <div>
              <p className="font-medium text-foreground">{response.participant_name}</p>
              <p className="text-sm text-muted-foreground">
                {response.selected_slots.length} slot(s) available
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
