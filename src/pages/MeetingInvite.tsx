import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import SocialMeta from "@/components/SocialMeta";
import { useMeetingInvite } from "@/hooks/useMeetingInvite";
import { useSubmitResponse } from "@/hooks/useSubmitResponse";
import { TimeSlotCard, ParticipantsList, ResponseForm } from "@/components/meeting";

const MeetingInvite = () => {
  const { inviteId } = useParams();
  const [participantName, setParticipantName] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [socialImageUrl, setSocialImageUrl] = useState<string>("");

  const { invite, isLoading, responses, getSlotParticipants } = useMeetingInvite(inviteId);
  const submitResponse = useSubmitResponse(inviteId);

  // Generate social image when invite data is available
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Calendar className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-spin" />
          <p className="text-lg text-gray-600">Loading meeting details...</p>
        </div>
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Meeting Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This meeting invite doesn't exist or has expired.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const socialTitle = `Meeting Invitation: ${invite.title}`;
  const socialDescription = `${invite.inviter_name} is requesting your availability for "${invite.title}". ${invite.available_slots.length} time options available. Please click to view times and share when you're free.${invite.description ? ' Details: ' + invite.description : ''}`;
  const socialUrl = window.location.href;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SocialMeta 
        title={socialTitle}
        description={socialDescription}
        image={socialImageUrl}
        url={socialUrl}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-3 shadow-lg">
                <Calendar className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{invite.title}</h1>
            <p className="text-lg text-gray-600 mb-2">Organized by {invite.inviter_name}</p>
            {invite.description && (
              <p className="text-gray-600 max-w-2xl mx-auto">{invite.description}</p>
            )}
            
            {/* Share link */}
            <div className="mt-6 flex justify-center">
              <Button
                variant="outline"
                onClick={copyLink}
                className="flex items-center gap-2"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied!" : "Share Link"}
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left side - Time slots */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Available Time Slots
                </CardTitle>
                <CardDescription>
                  Click on the times you're available
                </CardDescription>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>

            {/* Right side - Response form */}
            <ResponseForm
              participantName={participantName}
              onNameChange={setParticipantName}
              selectedSlots={selectedSlots}
              onSlotRemove={toggleSlot}
              onSubmit={handleSubmit}
              isSubmitting={submitResponse.isPending}
            />
          </div>

          <ParticipantsList responses={responses} />
        </div>
      </div>
    </div>
  );
};

export default MeetingInvite;
