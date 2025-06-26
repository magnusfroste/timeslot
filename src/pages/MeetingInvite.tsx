import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import SocialMeta from "@/components/SocialMeta";

const MeetingInvite = () => {
  const { inviteId } = useParams();
  const queryClient = useQueryClient();
  const [participantName, setParticipantName] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  // Fetch invite details
  const { data: invite, isLoading: inviteLoading } = useQuery({
    queryKey: ['invite', inviteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meeting_invites')
        .select('*')
        .eq('id', inviteId)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch participant responses
  const { data: responses = [], isLoading: responsesLoading } = useQuery({
    queryKey: ['responses', inviteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('participant_responses')
        .select('*')
        .eq('invite_id', inviteId);
      
      if (error) throw error;
      return data;
    },
  });

  // Submit response mutation
  const submitResponse = useMutation({
    mutationFn: async () => {
      if (!participantName.trim()) {
        throw new Error("Please enter your name");
      }
      if (selectedSlots.length === 0) {
        throw new Error("Please select at least one time slot");
      }

      const initials = participantName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const { data, error } = await supabase
        .from('participant_responses')
        .upsert({
          invite_id: inviteId,
          participant_name: participantName.trim(),
          participant_initials: initials,
          selected_slots: selectedSlots
        }, {
          onConflict: 'invite_id,participant_name'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success("Your availability has been recorded!");
      queryClient.invalidateQueries({ queryKey: ['responses', inviteId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    }
  });

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

  const getSlotParticipants = (slot: string) => {
    return responses.filter(response => 
      (response.selected_slots as string[]).includes(slot)
    );
  };

  if (inviteLoading) {
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

  // Generate social media content with dynamic image
  const socialTitle = `${invite.title} - TimeSlot Meeting Invite`;
  const socialDescription = `${invite.inviter_name} has invited you to "${invite.title}". Click to see available times and share your availability. ${invite.description ? invite.description : ''}`;
  const socialImage = `https://umjqoizuhfrxzjgrdvei.supabase.co/functions/v1/generate-social-image?inviteId=${inviteId}`;
  const socialUrl = window.location.href;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <SocialMeta 
        title={socialTitle}
        description={socialDescription}
        image={socialImage}
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
            {/* Left side - Time slots and responses */}
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
                  {(invite.available_slots as string[]).map((slot, index) => {
                    const slotParticipants = getSlotParticipants(slot);
                    const isSelected = selectedSlots.includes(slot);
                    
                    return (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleSlot(slot)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {format(new Date(slot), 'EEEE, MMMM d')}
                            </p>
                            <p className="text-gray-600">
                              {format(new Date(slot), 'h:mm a')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {slotParticipants.length}
                            </Badge>
                            {slotParticipants.length > 0 && (
                              <div className="flex gap-1">
                                {slotParticipants.slice(0, 3).map((participant, i) => (
                                  <div
                                    key={i}
                                    className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-semibold text-indigo-700"
                                    title={participant.participant_name}
                                  >
                                    {participant.participant_initials}
                                  </div>
                                ))}
                                {slotParticipants.length > 3 && (
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-semibold text-gray-600">
                                    +{slotParticipants.length - 3}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Right side - Participant form */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle>Your Response</CardTitle>
                <CardDescription>
                  Enter your name and select your available times
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={participantName}
                      onChange={(e) => setParticipantName(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Selected Times</Label>
                    <div className="mt-2 space-y-2">
                      {selectedSlots.length === 0 ? (
                        <p className="text-gray-500 text-sm">No times selected yet</p>
                      ) : (
                        selectedSlots.map((slot, index) => (
                          <div key={index} className="flex items-center justify-between bg-indigo-50 p-2 rounded">
                            <span className="text-sm">
                              {format(new Date(slot), 'EEE, MMM d - h:mm a')}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleSlot(slot)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={() => submitResponse.mutate()}
                    disabled={submitResponse.isPending || !participantName.trim() || selectedSlots.length === 0}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    {submitResponse.isPending ? "Saving..." : "Save My Availability"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* All participants summary */}
          {responses.length > 0 && (
            <Card className="mt-8 shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Participants ({responses.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {responses.map((response, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-white p-3 rounded-lg border"
                    >
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-semibold text-indigo-700">
                        {response.participant_initials}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{response.participant_name}</p>
                        <p className="text-sm text-gray-600">
                          {(response.selected_slots as string[]).length} slot(s) available
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingInvite;
