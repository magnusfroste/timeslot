import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { User, X } from "lucide-react";

interface ResponseFormProps {
  participantName: string;
  onNameChange: (name: string) => void;
  selectedSlots: string[];
  onSlotRemove: (slot: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ResponseForm({
  participantName,
  onNameChange,
  selectedSlots,
  onSlotRemove,
  onSubmit,
  isSubmitting,
}: ResponseFormProps) {
  return (
    <div className="glass-strong rounded-3xl p-6 shadow-glass">
      <div className="flex items-center gap-2 mb-2">
        <User className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Your Response</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-5">
        Enter your name and select your available times
      </p>

      <div className="space-y-5">
        <div>
          <Label htmlFor="name" className="text-foreground">Your Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={participantName}
            onChange={(e) => onNameChange(e.target.value)}
            className="mt-1.5 bg-background/50 border-border/50 focus:border-primary/50 rounded-xl"
          />
        </div>

        <div>
          <Label className="text-foreground">Selected Times</Label>
          <div className="mt-2 space-y-2">
            {selectedSlots.length === 0 ? (
              <p className="text-muted-foreground text-sm py-3 text-center bg-muted/30 rounded-xl">
                No times selected yet
              </p>
            ) : (
              selectedSlots.map((slot, index) => (
                <div key={index} className="flex items-center justify-between bg-primary/5 border border-primary/20 p-3 rounded-xl">
                  <span className="text-sm text-foreground">
                    {format(new Date(slot), 'EEE, MMM d - h:mm a')}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSlotRemove(slot)}
                    className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive rounded-lg"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>

        <Button 
          onClick={onSubmit}
          disabled={isSubmitting || !participantName.trim() || selectedSlots.length === 0}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 shadow-glow transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
        >
          {isSubmitting ? "Saving..." : "Save My Availability"}
        </Button>
      </div>
    </div>
  );
}
