
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CreateInvite = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    inviterName: "",
  });
  const [timeSlots, setTimeSlots] = useState([
    { date: "", time: "" }
  ]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate form
      if (!formData.title || !formData.inviterName) {
        toast.error("Please fill in the meeting title and your name");
        return;
      }

      // Filter and format valid time slots
      const validSlots = timeSlots
        .filter(slot => slot.date && slot.time)
        .map(slot => `${slot.date}T${slot.time}:00`);

      if (validSlots.length === 0) {
        toast.error("Please add at least one time slot");
        return;
      }

      console.log("Creating invite with data:", {
        title: formData.title,
        description: formData.description,
        inviter_name: formData.inviterName,
        available_slots: validSlots
      });

      const { data, error } = await supabase
        .from('meeting_invites')
        .insert({
          title: formData.title,
          description: formData.description,
          inviter_name: formData.inviterName,
          available_slots: validSlots
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating invite:", error);
        toast.error("Failed to create invite. Please try again.");
        return;
      }

      console.log("Created invite:", data);
      toast.success("Meeting invite created successfully!");
      navigate(`/invite/${data.id}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-semibold">Available Time Slots</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTimeSlot}
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
                          onChange={(e) => updateTimeSlot(index, 'date', e.target.value)}
                          className="flex-1"
                          min={new Date().toISOString().split('T')[0]}
                        />
                        <Input
                          type="time"
                          value={slot.time}
                          onChange={(e) => updateTimeSlot(index, 'time', e.target.value)}
                          className="flex-1"
                        />
                        {timeSlots.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeTimeSlot(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Create Invite & Get Link"}
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
