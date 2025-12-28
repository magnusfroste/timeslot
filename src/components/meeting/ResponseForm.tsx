import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

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
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle>Your Response</CardTitle>
        <CardDescription>
          Enter your name and select your available times
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={participantName}
              onChange={(e) => onNameChange(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Selected Times</Label>
            <div className="mt-2 space-y-2">
              {selectedSlots.length === 0 ? (
                <p className="text-gray-500 text-sm">No times selected yet</p>
              ) : (
                selectedSlots.map((slot, index) => (
                  <div key={index} className="flex items-center justify-between bg-indigo-50 p-2 rounded">
                    <span className="text-sm">
                      {format(new Date(slot), 'EEE, MMM d - h:mm a')}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSlotRemove(slot)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          <Button 
            onClick={onSubmit}
            disabled={isSubmitting || !participantName.trim() || selectedSlots.length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {isSubmitting ? "Saving..." : "Save My Availability"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
