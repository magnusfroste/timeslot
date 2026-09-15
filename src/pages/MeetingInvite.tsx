import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Copy, Check, ArrowLeft, Volume2, VolumeX, Globe, Plus, Pencil, Key, CalendarCheck } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import SocialMeta from "@/components/SocialMeta";
import { useMeetingInvite } from "@/hooks/useMeetingInvite";
import { useEditInvite } from "@/hooks/useEditInvite";
import { useSubmitResponse } from "@/hooks/useSubmitResponse";
import { useNotificationSound } from "@/hooks/useNotificationSound";
import { TimeSlotCard, ParticipantsList, ResponseForm } from "@/components/meeting";
import ShareButtons from "@/components/meeting/ShareButtons";
import Footer from "@/components/Footer";

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
  const { confirmSlot } = useEditInvite(inviteId, editToken || undefined);
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

  const handleConfirmSlot = (slot: string) => {
    // Toggle: if already confirmed, clear it; otherwise confirm this slot
    const newSlot = invite?.confirmed_slot === slot ? null : slot;
    confirmSlot(newSlot);
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

  // Format confirmed slot for display
  const getConfirmedSlotDisplay = () => {
    if (!invite?.confirmed_slot) return null;
    
    const creatorTimezone = invite.creator_timezone || 'UTC';
    const viewerTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const utcDate = fromZonedTime(invite.confirmed_slot, creatorTimezone);
    
    return {
      date: format(utcDate, 'EEEE, MMMM d'),
      time: format(utcDate, 'h:mm a'),
      timezone: viewerTimezone,
      utcDate
    };
  };

  const confirmedDisplay = getConfirmedSlotDisplay();

  // Generate Google Calendar URL
  const getGoogleCalendarUrl = () => {
    if (!confirmedDisplay || !invite) return '';
    
    const startDate = confirmedDisplay.utcDate;
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    const formatForGoogle = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: invite.title,
      dates: `${formatForGoogle(startDate)}/${formatForGoogle(endDate)}`,
      details: invite.description || `Meeting organized by ${invite.inviter_name}`,
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Generate Outlook Calendar URL
  const getOutlookCalendarUrl = () => {
    if (!confirmedDisplay || !invite) return '';
    
    const startDate = confirmedDisplay.utcDate;
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    
    const params = new URLSearchParams({
      subject: invite.title,
      body: invite.description || `Meeting organized by ${invite.inviter_name}`,
      startdt: startDate.toISOString(),
      enddt: endDate.toISOString(),
      path: '/calendar/action/compose',
      rru: 'addevent'
    });
    
    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
  };

  // Generate and download iCal file
  const downloadICalFile = () => {
    if (!confirmedDisplay || !invite) return;
    
    const startDate = confirmedDisplay.utcDate;
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    
    const formatForICal = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Meeting Scheduler//EN',
      'BEGIN:VEVENT',
      `DTSTART:${formatForICal(startDate)}`,
      `DTEND:${formatForICal(endDate)}`,
      `SUMMARY:${invite.title}`,
      `DESCRIPTION:${invite.description || `Meeting organized by ${invite.inviter_name}`}`,
      `ORGANIZER:${invite.inviter_name}`,
      `UID:${invite.id}@meetingscheduler`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${invite.title.replace(/[^a-z0-9]/gi, '-')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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

      {/* Confirmed Time Banner */}
      {confirmedDisplay && (
        <div className="relative bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 text-center">
              <div className="flex items-center gap-3">
                <CalendarCheck className="h-6 w-6 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium opacity-90">Meeting Confirmed</p>
                  <p className="text-lg md:text-xl font-bold">
                    {confirmedDisplay.date} at {confirmedDisplay.time}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 w-full md:w-auto">
                <a
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 md:flex-none items-center justify-center gap-1.5 px-3 min-h-11 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  Google
                </a>
                <a
                  href={getOutlookCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 md:flex-none items-center justify-center gap-1.5 px-3 min-h-11 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  Outlook
                </a>
                <button
                  onClick={downloadICalFile}
                  className="inline-flex flex-1 md:flex-none items-center justify-center gap-1.5 px-3 min-h-11 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                >
                  <Calendar className="h-4 w-4" />
                  iCal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="relative container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Top bar with buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 animate-fade-in gap-2">
            {editToken ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:flex-wrap [&_a]:w-full sm:[&_a]:w-auto [&_button]:w-full sm:[&_button]:w-auto">
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
            <Link to="/create" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                className="w-full sm:w-auto glass border-border/50 hover:bg-secondary/50 rounded-xl gap-2"
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
            
            {/* Share panel */}
            <div className="mt-6 mx-auto w-full max-w-xl glass rounded-2xl p-4 space-y-3">
              <Button
                onClick={copyLink}
                className="w-full rounded-xl gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Link copied!" : "Copy invite link"}
              </Button>

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-border/40" />
                <span className="text-xs text-muted-foreground">or share via</span>
                <span className="h-px flex-1 bg-border/40" />
              </div>

              <ShareButtons
                inviteId={inviteId!}
                title={invite.title}
                organizerName={invite.inviter_name}
                slotsCount={invite.available_slots.length}
              />
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
              {editToken && (
                <p className="text-xs text-muted-foreground/70 mb-3 flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-500" />
                  Tap a time slot, or use the Confirm button, to mark it as confirmed
                </p>
              )}
              <div className="space-y-3">
                {invite.available_slots.map((slot, index) => (
                  <TimeSlotCard
                    key={index}
                    slot={slot}
                    isSelected={selectedSlots.includes(slot)}
                    participants={getSlotParticipants(slot)}
                    onToggle={toggleSlot}
                    creatorTimezone={invite.creator_timezone}
                    isConfirmed={invite.confirmed_slot === slot}
                    isAdmin={!!editToken}
                    onConfirm={handleConfirmSlot}
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

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default MeetingInvite;
