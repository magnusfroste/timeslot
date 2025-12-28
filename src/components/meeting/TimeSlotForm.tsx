import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
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
        <Label className="text-base font-semibold">Available Time Slots</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Slot
        </Button>
      </div>

      <div className="space-y-3">
        {timeSlots.map((slot, index) => (
          <div key={index} className="flex gap-3 items-center">
            <Input
              type="date"
              value={slot.date}
              onChange={(e) => onUpdate(index, 'date', e.target.value)}
              className="flex-1"
              min={today}
            />
            <Input
              type="time"
              value={slot.time}
              onChange={(e) => onUpdate(index, 'time', e.target.value)}
              className="flex-1"
            />
            {timeSlots.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onRemove(index)}
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
