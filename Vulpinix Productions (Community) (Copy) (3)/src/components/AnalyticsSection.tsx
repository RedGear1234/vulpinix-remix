import { Card } from "./ui/card";
import { Instagram, Facebook, Linkedin, TrendingUp, Users, Heart, MessageCircle } from "lucide-react";

export function AnalyticsSection() {
  const platforms = [
    { name: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-500", likes: 2670, comments: 794 },
    { name: "Facebook", icon: Facebook, color: "from-blue-600 to-blue-400", likes: 1370, comments: 462 },
    { name: "LinkedIn", icon: Linkedin, color: "from-blue-500 to-cyan-500", likes: 342, comments: 178 },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-cyan-400 mb-4 tracking-wider uppercase">Analytics</h2>
          <h3 className="text-4xl sm:text-5xl text-white mb-6">
            Smart Analytics Dashboard
          </h3>
        </div>

        <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl shadow-purple-500/10">
          {/* Top metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <span className="text-gray-400">Total Engagement</span>
              </div>
              <div className="text-3xl text-white">82%</div>
              <div className="text-green-400 text-sm mt-1">↑ 12% this week</div>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border border-cyan-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-6 h-6 text-cyan-400" />
                <span className="text-gray-400">Total Likes</span>
              </div>
              <div className="text-3xl text-white">4,382</div>
              <div className="text-green-400 text-sm mt-1">↑ 8% this week</div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <MessageCircle className="w-6 h-6 text-blue-400" />
                <span className="text-gray-400">Total Comments</span>
              </div>
              <div className="text-3xl text-white">1,434</div>
              <div className="text-green-400 text-sm mt-1">↑ 15% this week</div>
            </div>
          </div>

          {/* Platform breakdown */}
          <div className="space-y-4">
            <h4 className="text-white text-xl mb-4">Platform Performance</h4>
            {platforms.map((platform, index) => (
              <div 
                key={index}
                className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/30 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${platform.color} p-2.5 shadow-lg`}>
                      <platform.icon className="w-full h-full text-white" />
                    </div>
                    <span className="text-white text-lg">{platform.name}</span>
                  </div>
                  
                  <div className="flex gap-8">
                    <div className="text-center">
                      <div className="text-gray-400 text-sm mb-1">Likes</div>
                      <div className="text-white text-xl">{platform.likes.toLocaleString()}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-gray-400 text-sm mb-1">Comments</div>
                      <div className="text-white text-xl">{platform.comments}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-2 bg-gradient-to-t from-purple-600 to-cyan-500 rounded-full"
                        style={{ height: `${20 + Math.random() * 30}px` }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
