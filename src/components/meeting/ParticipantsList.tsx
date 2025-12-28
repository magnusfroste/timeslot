import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import type { ParticipantResponse } from "@/types/meeting";

interface ParticipantsListProps {
  responses: ParticipantResponse[];
}

export function ParticipantsList({ responses }: ParticipantsListProps) {
  if (responses.length === 0) return null;

  return (
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
                  {response.selected_slots.length} slot(s) available
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
