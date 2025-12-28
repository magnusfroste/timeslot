import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, Zap, ArrowRight, CheckCircle, Github, Heart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen aurora-bg noise overflow-hidden">
      {/* Floating decorative elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-24 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground/80">Simple scheduling for everyone</span>
          </div>

          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl scale-150" />
              <div className="relative glass-strong rounded-3xl p-6 shadow-glass-lg">
                <Calendar className="h-14 w-14 text-primary" />
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="gradient-text">Timeslot</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
            The <span className="text-foreground font-semibold">simplest way</span> to schedule meetings.
            Create time slots, share the link, and let others pick their availability.
          </p>
          <p className="text-sm text-muted-foreground/70 mb-10">
            No registration required
          </p>

          {/* CTA Button */}
          <Link to="/create">
            <Button 
              size="lg" 
              className="group relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground text-base px-8 py-6 rounded-2xl shadow-glow transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5"
            >
              <span className="relative z-10 flex items-center gap-3">
                <Zap className="h-5 w-5" />
                Create Timeslot Invite
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </Link>
        </div>

        {/* Bento Grid Features */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto mb-24">
          {/* Feature 1 */}
          <div className="bento-item group animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-5 group-hover:scale-110 transition-transform duration-300">
              <Clock className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Set Time Slots</h3>
            <p className="text-muted-foreground leading-relaxed">
              Pick a few time slots that work for you. Keep it simple with just the options you prefer.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bento-item group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 mb-5 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-7 w-7 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Share Link</h3>
            <p className="text-muted-foreground leading-relaxed">
              Share via WhatsApp, email, or any messaging app. No accounts needed for participants.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bento-item group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-5 group-hover:scale-110 transition-transform duration-300">
              <Calendar className="h-7 w-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">See Results</h3>
            <p className="text-muted-foreground leading-relaxed">
              Watch in real-time as people select their availability. See initials and counts instantly.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="glass-strong rounded-3xl p-8 md:p-12 max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-10">
            Why Choose Timeslot?
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { title: "Lightning Fast", desc: "Create and share meeting timeslots in under 30 seconds" },
              { title: "No Sign-Up Required", desc: "Your participants can respond without creating accounts" },
              { title: "Real-Time Updates", desc: "See responses instantly as people make their selections" },
              { title: "Mobile Friendly", desc: "Works perfectly on all devices and screen sizes" },
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <CheckCircle className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 pb-8 text-center animate-fade-in">
          <div className="inline-flex items-center justify-center gap-4 md:gap-6 glass rounded-full px-6 py-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Free to use
            </span>
            <span className="w-px h-4 bg-border" />
            <span>Open Source (MIT)</span>
            <span className="w-px h-4 bg-border" />
            <a 
              href="https://github.com/magnusfroste/timeslot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
