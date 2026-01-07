import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, ArrowLeft, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateInvite } from "@/hooks/useCreateInvite";
import { TimeSlotForm } from "@/components/meeting";
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
  const navigate = useNavigate();
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

  const duplicateTimeSlot = (index: number) => {
    const slotToDuplicate = timeSlots[index];
    const newSlot = { ...slotToDuplicate };
    const newSlots = [...timeSlots];
    newSlots.splice(index + 1, 0, newSlot);
    setTimeSlots(newSlots);
    form.setValue("timeSlots", newSlots);
  };

  const handleSubmit = (data: CreateInviteFormData) => {
    createInvite.mutate({
      ...data,
      timeSlots,
    }, {
      onSuccess: (invite) => {
        // Store edit token in session storage so we can show edit link on invite page
        sessionStorage.setItem(`edit_token_${invite.id}`, invite.edit_token);
        navigate(`/invite/${invite.id}`);
      }
    });
  };

  return (
    <div className="min-h-screen aurora-bg noise overflow-hidden">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="relative container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 animate-fade-in">
            <Link to="/">
              <Button variant="outline" size="sm" className="glass border-border/50 hover:bg-secondary/50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl" />
                <div className="relative glass-strong rounded-xl p-2">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Create Meeting Invite</h1>
            </div>
          </div>

          {/* Form Card */}
          <div className="glass-strong rounded-3xl p-6 md:p-8 shadow-glass-lg animate-fade-in-up">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Meeting Details</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Describe your meeting and choose some times. Simple!
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Meeting Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Planning meeting, Project review"
                            className="bg-background/50 border-border/50 focus:border-primary/50 rounded-xl"
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
                        <FormLabel className="text-foreground">Your Name *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            className="bg-background/50 border-border/50 focus:border-primary/50 rounded-xl"
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
                        <FormLabel className="text-foreground">Description (optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the meeting"
                            rows={3}
                            className="bg-background/50 border-border/50 focus:border-primary/50 rounded-xl resize-none"
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
                        onDuplicate={duplicateTimeSlot}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 shadow-glow transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                  disabled={createInvite.isPending}
                >
                  {createInvite.isPending ? "Creating..." : "Create Invite"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateInvite;
