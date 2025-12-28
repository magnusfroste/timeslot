import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useCreateInvite } from "@/hooks/useCreateInvite";
import { TimeSlotForm } from "@/components/meeting/TimeSlotForm";
import { createInviteSchema, type CreateInviteFormData, type TimeSlot } from "@/lib/validations/invite";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const CreateInvite = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { date: "", time: "" }
  ]);

  const form = useForm<CreateInviteFormData>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      title: "",
      description: "",
      inviterName: "",
      timeSlots: [{ date: "", time: "" }],
    },
  });

  const createInvite = useCreateInvite();

  const addTimeSlot = () => {
    const newSlots = [...timeSlots, { date: "", time: "" }];
    setTimeSlots(newSlots);
    form.setValue("timeSlots", newSlots);
  };

  const removeTimeSlot = (index: number) => {
    if (timeSlots.length > 1) {
      const newSlots = timeSlots.filter((_, i) => i !== index);
      setTimeSlots(newSlots);
      form.setValue("timeSlots", newSlots);
    }
  };

  const updateTimeSlot = (index: number, field: 'date' | 'time', value: string) => {
    const updated = [...timeSlots];
    updated[index][field] = value;
    setTimeSlots(updated);
    form.setValue("timeSlots", updated, { shouldValidate: true });
  };

  const handleSubmit = (data: CreateInviteFormData) => {
    createInvite.mutate({
      ...data,
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
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meeting Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Team Sync, Project Review"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="inviterName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Brief description of the meeting"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="timeSlots"
                    render={() => (
                      <FormItem>
                        <TimeSlotForm
                          timeSlots={timeSlots}
                          onAdd={addTimeSlot}
                          onRemove={removeTimeSlot}
                          onUpdate={updateTimeSlot}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    disabled={createInvite.isPending}
                  >
                    {createInvite.isPending ? "Creating..." : "Create Invite & Get Link"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateInvite;
