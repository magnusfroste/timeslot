import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";
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
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected 
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onToggle(slot)}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-gray-900">
            {format(new Date(slot), 'EEEE, MMMM d')}
          </p>
          <p className="text-gray-600">
            {format(new Date(slot), 'h:mm a')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {participants.length}
          </Badge>
          {participants.length > 0 && (
            <div className="flex gap-1">
              {participants.slice(0, 3).map((participant, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-semibold text-indigo-700"
                  title={participant.participant_name}
                >
                  {participant.participant_initials}
                </div>
              ))}
              {participants.length > 3 && (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600">
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
