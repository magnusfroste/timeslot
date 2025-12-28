import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Clock } from "lucide-react";
import type { TimeSlot } from "@/hooks/useCreateInvite";

interface TimeSlotFormProps {
  timeSlots: TimeSlot[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: 'date' | 'time', value: string) => void;
}

export function TimeSlotForm({ timeSlots, onAdd, onRemove, onUpdate }: TimeSlotFormProps) {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <Label className="text-base font-semibold text-foreground">Available Time Slots</Label>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="glass border-border/50 hover:bg-secondary/50 rounded-xl"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Slot
        </Button>
      </div>

      <div className="space-y-3">
        {timeSlots.map((slot, index) => (
          <div key={index} className="flex gap-3 items-center bg-background/30 p-3 rounded-xl border border-border/30">
            <Input
              type="date"
              value={slot.date}
              onChange={(e) => onUpdate(index, 'date', e.target.value)}
              className="flex-1 bg-background/50 border-border/50 focus:border-primary/50 rounded-xl"
              min={today}
            />
            <Input
              type="time"
              value={slot.time}
              onChange={(e) => onUpdate(index, 'time', e.target.value)}
              className="flex-1 bg-background/50 border-border/50 focus:border-primary/50 rounded-xl"
            />
            {timeSlots.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onRemove(index)}
                className="h-10 w-10 shrink-0 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 rounded-xl"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
