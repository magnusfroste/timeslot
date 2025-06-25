
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

const CallToAction = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-blue-300 rounded-full animate-pulse delay-700"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
            Ready to Start Building?
          </h2>
          
          <p className="text-xl lg:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join thousands of developers who are already creating amazing applications with our platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold px-12 py-6 text-xl group transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              Start Free Trial
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="text-center sm:text-left">
              <p className="text-blue-100 text-sm">
                No credit card required
              </p>
              <p className="text-blue-200 text-sm font-medium">
                14-day free trial
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
