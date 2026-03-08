import { Upload, Sparkles, Users, LineChart, ArrowRight } from "lucide-react";

export function WorkflowSection() {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Content",
      description: "Upload your media files and content ideas"
    },
    {
      number: "02",
      icon: Sparkles,
      title: "AI Generates Captions",
      description: "Our AI creates engaging, optimized captions"
    },
    {
      number: "03",
      icon: Users,
      title: "Vulpinix Team Publishes",
      description: "Our team reviews and publishes your content"
    },
    {
      number: "04",
      icon: LineChart,
      title: "Get Analytics Reports",
      description: "Receive detailed performance analytics"
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-cyan-400 mb-4 tracking-wider uppercase">Workflow</h2>
          <h3 className="text-4xl sm:text-5xl text-white mb-6">
            How It Works
          </h3>
        </div>

        <div className="relative">
          {/* Desktop view */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="relative z-10">
                  <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-xl rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                    <div className="text-6xl bg-gradient-to-br from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4 opacity-30">
                      {step.number}
                    </div>
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 p-3 mb-4 shadow-lg shadow-purple-500/50">
                      <step.icon className="w-full h-full text-white" />
                    </div>
                    <h4 className="text-white text-xl mb-3">{step.title}</h4>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                </div>
                
                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="absolute top-1/2 -right-4 z-20 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-cyan-400" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile/Tablet view */}
          <div className="lg:hidden space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-xl rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-5xl bg-gradient-to-br from-purple-400 to-cyan-400 bg-clip-text text-transparent opacity-30">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 p-2 mb-3 shadow-lg shadow-purple-500/50">
                        <step.icon className="w-full h-full text-white" />
                      </div>
                      <h4 className="text-white text-xl mb-2">{step.title}</h4>
                      <p className="text-gray-400">{step.description}</p>
                    </div>
                  </div>
                </div>
                
                {/* Arrow connector for mobile */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center py-2">
                    <ArrowRight className="w-6 h-6 text-cyan-400 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
