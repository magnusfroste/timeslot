import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Copy, Check, ArrowLeft, Volume2, VolumeX, Globe, Plus, Pencil, Key } from "lucide-react";
import { toast } from "sonner";
import SocialMeta from "@/components/SocialMeta";
import { useMeetingInvite } from "@/hooks/useMeetingInvite";
import { useSubmitResponse } from "@/hooks/useSubmitResponse";
import { useNotificationSound } from "@/hooks/useNotificationSound";
import { TimeSlotCard, ParticipantsList, ResponseForm } from "@/components/meeting";
import ShareButtons from "@/components/meeting/ShareButtons";

const MeetingInvite = () => {
  const { inviteId } = useParams();
  const [participantName, setParticipantName] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [editLinkCopied, setEditLinkCopied] = useState(false);
  const [socialImageUrl, setSocialImageUrl] = useState<string>("");
  const prevResponseCount = useRef<number | null>(null);

  // Check if user has edit token (they're the creator)
  const editToken = inviteId ? sessionStorage.getItem(`edit_token_${inviteId}`) : null;

  const { invite, isLoading, responses, getSlotParticipants, isNewResponse, hasNewResponses } = useMeetingInvite(inviteId);
  const submitResponse = useSubmitResponse(inviteId);
  const { soundEnabled, toggleSound, playNotificationSound } = useNotificationSound();

  // Play sound when new responses come in
  useEffect(() => {
    if (prevResponseCount.current !== null && responses.length > prevResponseCount.current) {
      playNotificationSound();
    }
    prevResponseCount.current = responses.length;
  }, [responses.length, playNotificationSound]);

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

  const copyEditLink = () => {
    if (editToken && inviteId) {
      const editUrl = `${window.location.origin}/edit/${inviteId}/${editToken}`;
      navigator.clipboard.writeText(editUrl);
      setEditLinkCopied(true);
      toast.success("Secret edit link copied! Save this to edit your meeting later.");
      setTimeout(() => setEditLinkCopied(false), 3000);
    }
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
  const socialDescription = `${invite.inviter_name} wants to schedule a meeting with you! ${invite.available_slots.length} time slots to choose from. Respond directly by clicking the link.`;
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
          {/* Top bar with buttons */}
          <div className="flex justify-between items-center mb-4 animate-fade-in gap-2">
            {editToken ? (
              <div className="flex items-center gap-2 flex-wrap">
                <Link to={`/edit/${inviteId}/${editToken}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="glass border-border/50 hover:bg-secondary/50 rounded-xl gap-2"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Meeting
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyEditLink}
                  className="glass border-border/50 hover:bg-secondary/50 rounded-xl gap-2"
                >
                  {editLinkCopied ? <Check className="h-4 w-4 text-accent" /> : <Key className="h-4 w-4" />}
                  {editLinkCopied ? "Copied!" : "Copy Edit Link"}
                </Button>
              </div>
            ) : (
              <div />
            )}
            <Link to="/create">
              <Button
                variant="outline"
                size="sm"
                className="glass border-border/50 hover:bg-secondary/50 rounded-xl gap-2"
              >
                <Plus className="h-4 w-4" />
                Create New Meeting
              </Button>
            </Link>
          </div>

          {/* Organizer notice */}
          {editToken && (
            <div className="glass rounded-xl p-3 mb-6 border border-accent/30 bg-accent/5 animate-fade-in">
              <p className="text-sm text-center text-muted-foreground">
                <span className="text-accent font-medium">You're the organizer.</span> Save your edit link to make changes later - it won't be shown again after you leave!
              </p>
            </div>
          )}

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
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </div>
              
              <div className="border-t border-border/30 pt-3">
                <p className="text-xs text-muted-foreground mb-2 text-center">Share via</p>
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
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">Available Time Slots</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleSound}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    title={soundEnabled ? "Mute notifications" : "Enable sound notifications"}
                  >
                    {soundEnabled ? (
                      <Volume2 className="h-3.5 w-3.5" />
                    ) : (
                      <VolumeX className="h-3.5 w-3.5" />
                    )}
                  </button>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className={`relative flex h-2 w-2 ${hasNewResponses ? 'animate-pulse' : ''}`}>
                      <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                    </span>
                    Live
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Click on the times you're available. The number shows how many have responded.
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70 mb-5">
                <Globe className="h-3 w-3" />
                <span>
                  Showing times in your timezone ({Intl.DateTimeFormat().resolvedOptions().timeZone})
                </span>
              </div>
              <div className="space-y-3">
                {invite.available_slots.map((slot, index) => (
                  <TimeSlotCard
                    key={index}
                    slot={slot}
                    isSelected={selectedSlots.includes(slot)}
                    participants={getSlotParticipants(slot)}
                    onToggle={toggleSlot}
                    creatorTimezone={invite.creator_timezone}
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
