
import { Zap, Shield, Rocket, Users, Code, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Built for speed and performance with modern technologies that deliver exceptional user experiences."
    },
    {
      icon: Shield,
      title: "Secure by Design",
      description: "Enterprise-grade security measures ensure your data and applications are protected at all times."
    },
    {
      icon: Rocket,
      title: "Deploy Instantly",
      description: "Go from development to production in minutes with our streamlined deployment pipeline."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Work seamlessly with your team using built-in collaboration tools and real-time updates."
    },
    {
      icon: Code,
      title: "Developer Friendly",
      description: "Clean APIs, comprehensive documentation, and powerful developer tools make building a joy."
    },
    {
      icon: Sparkles,
      title: "AI-Powered",
      description: "Leverage artificial intelligence to automate tasks and enhance your development workflow."
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the features that make us the preferred choice for developers and businesses worldwide.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-2 bg-gradient-to-br from-white to-blue-50/50"
            >
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
