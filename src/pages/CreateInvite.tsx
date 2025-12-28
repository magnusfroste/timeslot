import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, ArrowLeft, Sparkles, Check, Copy, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateInvite } from "@/hooks/useCreateInvite";
import { TimeSlotForm, ShareButtons } from "@/components/meeting";
import { createInviteSchema, type CreateInviteFormData, type TimeSlot } from "@/lib/validations/invite";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface CreatedInvite {
  id: string;
  title: string;
  inviter_name: string;
  available_slots: string[];
}

const CreateInvite = () => {
  const navigate = useNavigate();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { date: "", time: "" }
  ]);
  const [createdInvite, setCreatedInvite] = useState<CreatedInvite | null>(null);
  const [copied, setCopied] = useState(false);

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
    }, {
      onSuccess: (invite) => {
        setCreatedInvite(invite);
      }
    });
  };

  const copyLink = () => {
    if (!createdInvite) return;
    const link = `${window.location.origin}/invite/${createdInvite.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateAnother = () => {
    setCreatedInvite(null);
    setTimeSlots([{ date: "", time: "" }]);
    form.reset();
  };

  // Success state - show sharing options
  if (createdInvite) {
    return (
      <div className="min-h-screen aurora-bg noise overflow-hidden">
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        </div>

        <div className="relative container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Card */}
            <div className="glass-strong rounded-3xl p-6 md:p-8 shadow-glass-lg animate-fade-in-up text-center">
              {/* Success icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent/30 rounded-full blur-xl scale-150 animate-pulse" />
                  <div className="relative w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                    <Check className="h-10 w-10 text-accent" />
                  </div>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Mötet skapat! 🎉
              </h1>
              <p className="text-muted-foreground mb-6">
                Din mötesinbjudan "<span className="text-foreground font-medium">{createdInvite.title}</span>" är redo att delas.
              </p>

              {/* Quick copy link */}
              <div className="bg-background/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Delningslänk</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-foreground bg-background/50 rounded-lg px-3 py-2 truncate">
                    {window.location.origin}/invite/{createdInvite.id}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyLink}
                    className="glass border-border/50 hover:bg-secondary/50 rounded-xl gap-2 shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Kopierad!" : "Kopiera"}
                  </Button>
                </div>
              </div>

              {/* Share buttons */}
              <div className="border-t border-border/30 pt-6 mb-6">
                <p className="text-sm text-muted-foreground mb-3">Dela direkt via</p>
                <ShareButtons
                  inviteId={createdInvite.id}
                  title={createdInvite.title}
                  organizerName={createdInvite.inviter_name}
                  slotsCount={createdInvite.available_slots.length}
                />
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => navigate(`/invite/${createdInvite.id}`)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Visa inbjudan
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCreateAnother}
                  className="glass border-border/50 hover:bg-secondary/50 rounded-xl gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Skapa nytt möte
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                Tillbaka
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl" />
                <div className="relative glass-strong rounded-xl p-2">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Skapa mötesinbjudan</h1>
            </div>
          </div>

          {/* Form Card */}
          <div className="glass-strong rounded-3xl p-6 md:p-8 shadow-glass-lg animate-fade-in-up">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Mötesdetaljer</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Beskriv ditt möte och välj några tider. Enkelt!
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Mötestitel *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="t.ex. Planeringsmöte, Projektuppföljning"
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
                        <FormLabel className="text-foreground">Ditt namn *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ditt namn"
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
                        <FormLabel className="text-foreground">Beskrivning (valfritt)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Kort beskrivning av mötet"
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
                  {createInvite.isPending ? "Skapar..." : "Skapa inbjudan"}
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
