
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Users, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-20">
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-full p-6 shadow-2xl ring-1 ring-indigo-100 animate-pulse">
              <Calendar className="h-16 w-16 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-6 leading-tight">
            Timeslot
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
            The <span className="font-semibold text-indigo-600">simplest way</span> to schedule meetings. 
            Create time slots, share the link, and let others pick their availability. 
            <span className="block mt-2 text-lg text-gray-600">No registration required.</span>
          </p>
          <Link to="/create">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 group">
              <Zap className="mr-3 h-6 w-6 group-hover:animate-pulse" />
              Create Meeting Invite
              <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
          <Card className="text-center border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-10 w-10 text-indigo-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Set Time Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg text-gray-600 leading-relaxed">
                Pick a few time slots that work for you. Keep it simple with just the options you prefer.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">Share Link</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg text-gray-600 leading-relaxed">
                Share the link via WhatsApp, email, or any messaging app. No accounts needed for participants.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
            <CardHeader className="pb-4">
              <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-10 w-10 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">See Results</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg text-gray-600 leading-relaxed">
                Watch in real-time as people select their availability. See initials and participant counts instantly.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
            Why Choose MeetUp?
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Lightning Fast</h3>
                <p className="text-gray-600">Create and share meeting invites in under 30 seconds</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">No Sign-Up Required</h3>
                <p className="text-gray-600">Your participants can respond without creating accounts</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Real-Time Updates</h3>
                <p className="text-gray-600">See responses instantly as people make their selections</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Mobile Friendly</h3>
                <p className="text-gray-600">Works perfectly on all devices and screen sizes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
