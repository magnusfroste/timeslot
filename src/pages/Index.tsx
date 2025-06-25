
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Calendar className="h-12 w-12 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            MeetUp
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The simplest way to schedule meetings. Create time slots, share the link, and let others pick their availability. No registration required.
          </p>
          <Link to="/create">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8 py-3 rounded-full">
              <Zap className="mr-2 h-5 w-5" />
              Create Meeting Invite
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="bg-indigo-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
              <CardTitle className="text-xl">Set Time Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Pick a few time slots that work for you. Keep it simple with just the options you prefer.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">Share Link</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Share the link via WhatsApp, email, or any messaging app. No accounts needed for participants.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg">
            <CardHeader>
              <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-xl">See Results</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Watch in real-time as people select their availability. See initials and participant counts instantly.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
