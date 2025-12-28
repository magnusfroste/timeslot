import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Copy, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import SocialMeta from "@/components/SocialMeta";
import { useMeetingInvite } from "@/hooks/useMeetingInvite";
import { useSubmitResponse } from "@/hooks/useSubmitResponse";
import { TimeSlotCard, ParticipantsList, ResponseForm } from "@/components/meeting";
import ShareButtons from "@/components/meeting/ShareButtons";

const MeetingInvite = () => {
  const { inviteId } = useParams();
  const [participantName, setParticipantName] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [socialImageUrl, setSocialImageUrl] = useState<string>("");

  const { invite, isLoading, responses, getSlotParticipants, isNewResponse } = useMeetingInvite(inviteId);
  const submitResponse = useSubmitResponse(inviteId);

  useEffect(() => {
    if (invite && invite.available_slots && Array.isArray(invite.available_slots)) {
      const collaborationImage = `https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=630&fit=crop&crop=center&auto=format`;
      setSocialImageUrl(collaborationImage);
    }
  }, [invite]);

  const toggleSlot = (slot: string) => {
    setSelectedSlots(prev => 
      prev.includes(slot) 
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    );
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    submitResponse.mutate({ participantName, selectedSlots });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen aurora-bg noise flex items-center justify-center">
        <div className="text-center glass-strong rounded-3xl p-8 animate-pulse-soft">
          <Calendar className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
          <p className="text-lg text-muted-foreground">Loading meeting details...</p>
        </div>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="min-h-screen aurora-bg noise flex items-center justify-center p-4">
        <div className="glass-strong rounded-3xl p-8 max-w-md text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Calendar className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Meeting Not Found</h2>
          <p className="text-muted-foreground mb-6">This meeting invite doesn't exist or has expired.</p>
          <Link to="/">
            <Button className="bg-primary hover:bg-primary/90 rounded-xl">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const socialTitle = invite.title;
  const socialDescription = `${invite.inviter_name} vill boka ett möte med dig! ${invite.available_slots.length} tider att välja mellan. Svara direkt genom att klicka på länken.`;
  const socialUrl = window.location.href;

  return (
    <div className="min-h-screen aurora-bg noise overflow-hidden">
      <SocialMeta 
        title={socialTitle}
        description={socialDescription}
        image={socialImageUrl}
        url={socialUrl}
      />

      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      </div>
      
      <div className="relative container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl scale-150" />
                <div className="relative glass-strong rounded-2xl p-4 shadow-glass-lg">
                  <Calendar className="h-10 w-10 text-primary" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">{invite.title}</h1>
            <p className="text-lg text-muted-foreground mb-1">Organized by {invite.inviter_name}</p>
            {invite.description && (
              <p className="text-muted-foreground max-w-2xl mx-auto mt-2">{invite.description}</p>
            )}
            
            {/* Share buttons */}
            <div className="mt-6 space-y-3">
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={copyLink}
                  className="glass border-border/50 hover:bg-secondary/50 rounded-xl gap-2"
                >
                  {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Kopierad!" : "Kopiera länk"}
                </Button>
              </div>
              
              <div className="border-t border-border/30 pt-3">
                <p className="text-xs text-muted-foreground mb-2 text-center">Dela via</p>
                <ShareButtons 
                  inviteId={inviteId!}
                  title={invite.title}
                  organizerName={invite.inviter_name}
                  slotsCount={invite.available_slots.length}
                />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
            {/* Left side - Time slots */}
            <div className="glass-strong rounded-3xl p-6 shadow-glass animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Available Time Slots</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5">
                Click on the times you're available
              </p>
              <div className="space-y-3">
                {invite.available_slots.map((slot, index) => (
                  <TimeSlotCard
                    key={index}
                    slot={slot}
                    isSelected={selectedSlots.includes(slot)}
                    participants={getSlotParticipants(slot)}
                    onToggle={toggleSlot}
                  />
                ))}
              </div>
            </div>

            {/* Right side - Response form */}
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <ResponseForm
                participantName={participantName}
                onNameChange={setParticipantName}
                selectedSlots={selectedSlots}
                onSlotRemove={toggleSlot}
                onSubmit={handleSubmit}
                isSubmitting={submitResponse.isPending}
              />
            </div>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <ParticipantsList responses={responses} isNewResponse={isNewResponse} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingInvite;
