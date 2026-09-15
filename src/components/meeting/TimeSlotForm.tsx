import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Clock, Copy, Globe } from "lucide-react";
import { format, addDays, nextMonday } from "date-fns";
import type { TimeSlot } from "@/hooks/useCreateInvite";

interface TimeSlotFormProps {
  timeSlots: TimeSlot[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: 'date' | 'time', value: string) => void;
  onDuplicate?: (index: number) => void;
}

const QUICK_TIMES = ["09:00", "11:00", "13:00", "15:00"];

function toDateValue(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function formatSlotPreview(slot: TimeSlot): string | null {
  if (!slot.date || !slot.time) return null;
  const parsed = new Date(`${slot.date}T${slot.time}:00`);
  if (isNaN(parsed.getTime())) return null;
  return format(parsed, "EEE, MMM d · h:mm a");
}

export function TimeSlotForm({ timeSlots, onAdd, onRemove, onUpdate, onDuplicate }: TimeSlotFormProps) {
  const today = new Date();
  const todayValue = toDateValue(today);
  const viewerTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const quickDates = [
    { label: "Today", value: todayValue },
    { label: "Tomorrow", value: toDateValue(addDays(today, 1)) },
    { label: "Next Monday", value: toDateValue(nextMonday(today)) },
  ];

  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <Label className="text-base font-semibold text-foreground">Proposed Times</Label>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          We recommend proposing 4-6 time slots. Too many options can be overwhelming for participants.
        </p>
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
          <Globe className="h-3 w-3" />
          Times are in your timezone ({viewerTimezone}) and shown to others in theirs.
        </p>
      </div>

      <div className="space-y-3">
        {timeSlots.map((slot, index) => {
          const preview = formatSlotPreview(slot);
          return (
            <div key={index}>
              <div className="bg-background/30 p-3 rounded-xl border border-border/30 space-y-3">
                <div className="flex gap-3 items-center">
                  <Input
                    type="date"
                    value={slot.date}
                    onChange={(e) => onUpdate(index, 'date', e.target.value)}
                    className="flex-1 bg-background/50 border-border/50 focus:border-primary/50 rounded-xl"
                    min={todayValue}
                  />
                  <Input
                    type="time"
                    value={slot.time}
                    onChange={(e) => onUpdate(index, 'time', e.target.value)}
                    className="flex-1 bg-background/50 border-border/50 focus:border-primary/50 rounded-xl"
                  />
                  {onDuplicate && (slot.date || slot.time) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => onDuplicate(index)}
                      className="h-10 w-10 shrink-0 hover:bg-primary/10 hover:text-primary hover:border-primary/50 rounded-xl"
                      title="Duplicate"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                  {timeSlots.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => onRemove(index)}
                      className="h-10 w-10 shrink-0 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 rounded-xl"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {quickDates.map((qd) => (
                    <button
                      key={qd.label}
                      type="button"
                      onClick={() => onUpdate(index, 'date', qd.value)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        slot.date === qd.value
                          ? 'border-primary/60 bg-primary/10 text-primary'
                          : 'border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                      }`}
                    >
                      {qd.label}
                    </button>
                  ))}
                  <span className="w-px bg-border/60 mx-1 self-stretch" aria-hidden="true" />
                  {QUICK_TIMES.map((qt) => (
                    <button
                      key={qt}
                      type="button"
                      onClick={() => onUpdate(index, 'time', qt)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        slot.time === qt
                          ? 'border-primary/60 bg-primary/10 text-primary'
                          : 'border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                      }`}
                    >
                      {qt}
                    </button>
                  ))}
                </div>

                {preview && (
                  <p className="text-sm font-medium text-foreground">{preview}</p>
                )}
              </div>

              {/* Add slot button after first row */}
              {index === 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onAdd}
                  className="mt-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-xl"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Time
                </Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
