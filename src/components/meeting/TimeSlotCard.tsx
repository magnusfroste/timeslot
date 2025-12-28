import { Badge } from "@/components/ui/badge";
import { Users, Check } from "lucide-react";
import { format } from "date-fns";
import type { ParticipantResponse } from "@/types/meeting";

interface TimeSlotCardProps {
  slot: string;
  isSelected: boolean;
  participants: ParticipantResponse[];
  onToggle: (slot: string) => void;
}

export function TimeSlotCard({ slot, isSelected, participants, onToggle }: TimeSlotCardProps) {
  return (
    <div
      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
        isSelected 
          ? 'border-primary bg-primary/5 shadow-glow'
          : 'border-border/50 bg-background/30 hover:border-border hover:bg-background/50'
      }`}
      onClick={() => onToggle(slot)}
    >
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          {isSelected && (
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
          <div>
            <p className="font-semibold text-foreground">
              {format(new Date(slot), 'EEEE, MMMM d')}
            </p>
            <p className="text-sm text-muted-foreground">
              {format(new Date(slot), 'h:mm a')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1 rounded-lg bg-secondary/50">
            <Users className="h-3 w-3" />
            {participants.length}
          </Badge>
          {participants.length > 0 && (
            <div className="flex -space-x-2">
              {participants.slice(0, 3).map((participant, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-primary/10 border-2 border-background rounded-full flex items-center justify-center text-xs font-semibold text-primary"
                  title={participant.participant_name}
                >
                  {participant.participant_initials}
                </div>
              ))}
              {participants.length > 3 && (
                <div className="w-8 h-8 bg-muted border-2 border-background rounded-full flex items-center justify-center text-xs font-semibold text-muted-foreground">
                  +{participants.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
