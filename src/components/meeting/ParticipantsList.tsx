import { Users, Sparkles } from "lucide-react";
import type { ParticipantResponse } from "@/types/meeting";

interface ParticipantsListProps {
  responses: ParticipantResponse[];
  isNewResponse?: (id: string) => boolean;
}

export function ParticipantsList({ responses, isNewResponse }: ParticipantsListProps) {
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
        {responses.map((response) => {
          const isNew = isNewResponse?.(response.id);
          return (
            <div
              key={response.id}
              className={`flex items-center gap-3 bg-background/50 border p-3 rounded-2xl hover-lift transition-all duration-500 ${
                isNew 
                  ? 'border-accent ring-2 ring-accent/30 animate-scale-in' 
                  : 'border-border/50'
              }`}
            >
              <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                isNew ? 'bg-accent/20 text-accent' : 'bg-primary/10 text-primary'
              }`}>
                {response.participant_initials}
                {isNew && (
                  <span className="absolute -top-1 -right-1">
                    <Sparkles className="h-4 w-4 text-accent animate-pulse" />
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{response.participant_name}</p>
                  {isNew && (
                    <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full font-medium">
                      New!
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {response.selected_slots.length} slot(s) available
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
