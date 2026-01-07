import { Badge } from "@/components/ui/badge";
import { Users, Check } from "lucide-react";
import { format } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import type { ParticipantResponse } from "@/types/meeting";

interface TimeSlotCardProps {
  slot: string;
  isSelected: boolean;
  participants: ParticipantResponse[];
  onToggle: (slot: string) => void;
  creatorTimezone?: string;
  isConfirmed?: boolean;
  isAdmin?: boolean;
  onConfirm?: (slot: string) => void;
}

function getShortTimezone(timezone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short'
    });
    const parts = formatter.formatToParts(new Date());
    const tzPart = parts.find(p => p.type === 'timeZoneName');
    return tzPart?.value || timezone.split('/').pop() || timezone;
  } catch {
    return timezone.split('/').pop() || timezone;
  }
}

export function TimeSlotCard({ slot, isSelected, participants, onToggle, creatorTimezone, isConfirmed, isAdmin, onConfirm }: TimeSlotCardProps) {
  const viewerTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const isSameTimezone = creatorTimezone === viewerTimezone;
  
  // Convert the slot from creator's timezone to UTC, then to viewer's local time
  let localDate: Date;
  let creatorDate: Date;
  
  if (creatorTimezone) {
    // The slot is in creator's timezone, convert to UTC first
    const utcDate = fromZonedTime(slot, creatorTimezone);
    localDate = utcDate; // This will display in viewer's local timezone
    creatorDate = new Date(slot); // Original time as entered by creator
  } else {
    localDate = new Date(slot);
    creatorDate = new Date(slot);
  }

  const handleClick = () => {
    if (isAdmin && onConfirm) {
      // Admin click: toggle confirmation
      onConfirm(slot);
    } else {
      // Regular participant click: toggle selection
      onToggle(slot);
    }
  };

  const getCardClasses = () => {
    if (isConfirmed) {
      return 'border-green-500 bg-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]';
    }
    if (isSelected) {
      return 'border-primary bg-primary/5 shadow-glow';
    }
    return 'border-border/50 bg-background/30 hover:border-border hover:bg-background/50';
  };

  return (
    <div
      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${getCardClasses()} ${isAdmin ? 'hover:ring-2 hover:ring-green-500/30' : ''}`}
      onClick={handleClick}
      title={isAdmin ? (isConfirmed ? 'Click to unconfirm' : 'Click to confirm this time') : undefined}
    >
      <div className="flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          {isConfirmed ? (
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          ) : isSelected ? (
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <Check className="h-4 w-4 text-primary-foreground" />
            </div>
          ) : null}
          <div>
            <div className="flex items-center gap-2">
              <p className={`font-semibold ${isConfirmed ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
                {format(localDate, 'EEEE, MMMM d')}
              </p>
              {isConfirmed && (
                <Badge className="bg-green-500 text-white text-[10px] px-1.5 py-0">
                  CONFIRMED
                </Badge>
              )}
            </div>
            <p className={`text-sm ${isConfirmed ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
              {format(localDate, 'h:mm a')}
              {!isSameTimezone && creatorTimezone && (
                <span className="text-muted-foreground ml-1">
                  ({format(creatorDate, 'h:mm a')} {getShortTimezone(creatorTimezone)})
                </span>
              )}
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
