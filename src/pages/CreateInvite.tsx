import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useCreateInvite, type TimeSlot } from "@/hooks/useCreateInvite";
import { TimeSlotForm } from "@/components/meeting/TimeSlotForm";

const CreateInvite = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    inviterName: "",
  });
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { date: "", time: "" }
  ]);

  const createInvite = useCreateInvite();

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, { date: "", time: "" }]);
  };

  const removeTimeSlot = (index: number) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((_, i) => i !== index));
    }
  };

  const updateTimeSlot = (index: number, field: 'date' | 'time', value: string) => {
    const updated = [...timeSlots];
    updated[index][field] = value;
    setTimeSlots(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createInvite.mutate({
      title: formData.title,
      description: formData.description,
      inviterName: formData.inviterName,
      timeSlots,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <Link to="/" className="mr-4">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Create Timeslots Invite</h1>
            </div>
          </div>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle>Meeting Details</CardTitle>
              <CardDescription>
                Propose your meeting and pick some time slots. Keep it simple!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Meeting Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Team Sync, Project Review"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="inviterName">Your Name *</Label>
                    <Input
                      id="inviterName"
                      placeholder="Your name"
                      value={formData.inviterName}
                      onChange={(e) => setFormData({...formData, inviterName: e.target.value})}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of the meeting"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>

                <TimeSlotForm
                  timeSlots={timeSlots}
                  onAdd={addTimeSlot}
                  onRemove={removeTimeSlot}
                  onUpdate={updateTimeSlot}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={createInvite.isPending}
                >
                  {createInvite.isPending ? "Creating..." : "Create Invite & Get Link"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateInvite;
