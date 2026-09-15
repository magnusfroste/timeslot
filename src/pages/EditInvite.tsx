import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, ArrowLeft, Pencil, Trash2, AlertTriangle, Eye } from "lucide-react";
import { useEditInvite } from "@/hooks/useEditInvite";
import { TimeSlotForm } from "@/components/meeting";
import { createInviteSchema, type CreateInviteFormData, type TimeSlot } from "@/lib/validations/invite";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function parseTimeSlots(slots: string[]): TimeSlot[] {
  return slots.map(slot => {
    const [date, timePart] = slot.split('T');
    const time = timePart ? timePart.slice(0, 5) : '';
    return { date, time };
  });
}

function formatTimeSlots(timeSlots: TimeSlot[]): string[] {
  return timeSlots
    .filter(slot => slot.date && slot.time)
    .map(slot => `${slot.date}T${slot.time}:00`);
}

const EditInvite = () => {
  const { inviteId, editToken } = useParams();
  const navigate = useNavigate();
  const { invite, isLoading, isValidToken, updateInvite, isUpdating, deleteInvite, isDeleting } = useEditInvite(inviteId, editToken);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([{ date: "", time: "" }]);

  const form = useForm<CreateInviteFormData>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      title: "",
      description: "",
      inviterName: "",
      timeSlots: [{ date: "", time: "" }],
    },
  });

  // Populate form when invite loads
  useEffect(() => {
    if (invite) {
      const parsedSlots = parseTimeSlots(invite.available_slots);
      setTimeSlots(parsedSlots.length > 0 ? parsedSlots : [{ date: "", time: "" }]);
      form.reset({
        title: invite.title,
        description: invite.description || "",
        inviterName: invite.inviter_name,
        timeSlots: parsedSlots.length > 0 ? parsedSlots : [{ date: "", time: "" }],
      });
    }
  }, [invite, form]);

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
    updateInvite({
      title: data.title,
      description: data.description || "",
      inviterName: data.inviterName,
      availableSlots: formatTimeSlots(timeSlots),
    });
  };

  const handleDelete = () => {
    deleteInvite();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen aurora-bg noise flex items-center justify-center">
        <div className="glass-strong rounded-3xl p-8 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/30 animate-spin" />
            <span className="text-muted-foreground">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoading && !isValidToken) {
    return (
      <div className="min-h-screen aurora-bg noise flex items-center justify-center">
        <div className="glass-strong rounded-3xl p-8 text-center max-w-md mx-4">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">Invalid Edit Link</h1>
          <p className="text-muted-foreground mb-6">
            This edit link is invalid or has expired. Only the meeting organizer can access this page.
          </p>
          <Link to="/">
            <Button variant="outline" className="glass border-border/50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen aurora-bg noise overflow-hidden">
      <PageMeta
        title="Edit Meeting – Timeslot"
        description="Update your meeting details, change proposed times, or delete the invite using your private edit link."
        path="/edit"
        noindex
      />
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      </div>

      <div className="relative container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 mb-8 animate-fade-in">
            <div className="flex items-center gap-4">
              <Link to={`/invite/${inviteId}`}>
                <Button variant="outline" size="sm" className="glass border-border/50 hover:bg-secondary/50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl" />
                  <div className="relative glass-strong rounded-xl p-2">
                    <Pencil className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">Edit Meeting</h1>
              </div>
            </div>
            <Link to={`/invite/${inviteId}`}>
              <Button variant="outline" size="sm" className="glass border-border/50 hover:bg-secondary/50 gap-2">
                <Eye className="h-4 w-4" />
                View
              </Button>
            </Link>
          </div>

          {/* Form Card */}
          <div className="glass-strong rounded-3xl p-6 md:p-8 shadow-glass-lg animate-fade-in-up">
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

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-6 shadow-glow transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        type="button"
                        variant="destructive"
                        className="rounded-xl py-6 gap-2"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="glass-strong border-border/50">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this meeting?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. All responses from participants will also be deleted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={handleDelete}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                        >
                          Delete Meeting
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </form>
            </Form>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default EditInvite;
