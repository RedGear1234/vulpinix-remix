import { Card } from "./ui/card";
import { Sparkles, Share2, BarChart3 } from "lucide-react";

export function AboutSection() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Captions",
      description: "Generate engaging captions automatically using advanced AI technology",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Share2,
      title: "Multi-Platform Publishing",
      description: "Publish seamlessly across all major social media platforms",
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      icon: BarChart3,
      title: "Real-Time Analytics",
      description: "Track performance with comprehensive analytics and insights",
      gradient: "from-blue-500 to-purple-500"
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-cyan-400 mb-4 tracking-wider uppercase">About</h2>
          <h3 className="text-4xl sm:text-5xl text-white mb-6">
            What is Vulpinix AI 1.0?
          </h3>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Vulpinix AI helps you automate your social media content publishing, analytics, 
            and ad management — powered by OpenAI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 backdrop-blur-xl p-8 rounded-2xl hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/20"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-6 shadow-lg`}>
                <feature.icon className="w-full h-full text-white" />
              </div>
              <h4 className="text-white text-xl mb-3">{feature.title}</h4>
              <p className="text-gray-400">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
