import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowLeft, BookOpen, Calendar, Clock, ArrowRight, TrendingUp, Sparkles, Target } from "lucide-react";
import { Button } from "../components/ui/button";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
}

export default function BlogsPage() {
  const navigate = useNavigate();

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "The Future of AI in Digital Marketing: Trends to Watch in 2026",
      excerpt: "Explore how artificial intelligence is revolutionizing digital marketing strategies and what it means for businesses in the coming years.",
      author: "Sarah Johnson",
      date: "February 10, 2026",
      readTime: "5 min read",
      category: "AI Trends",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
    },
    {
      id: 2,
      title: "10 Ways to Optimize Your Social Media Ad Campaigns",
      excerpt: "Learn proven strategies to maximize ROI on your social media advertising across Instagram, Facebook, and YouTube.",
      author: "Michael Chen",
      date: "February 8, 2026",
      readTime: "7 min read",
      category: "Marketing Tips",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"
    },
    {
      id: 3,
      title: "How VULPINIX AI Increased Campaign Performance by 300%",
      excerpt: "A detailed case study on how our AI-powered platform helped a startup achieve unprecedented marketing results.",
      author: "Emma Davis",
      date: "February 5, 2026",
      readTime: "6 min read",
      category: "Case Study",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
    },
    {
      id: 4,
      title: "Understanding Instagram Algorithm Updates for Better Reach",
      excerpt: "Deep dive into the latest Instagram algorithm changes and how to adapt your content strategy accordingly.",
      author: "Alex Rodriguez",
      date: "February 3, 2026",
      readTime: "4 min read",
      category: "Social Media",
      image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80"
    },
    {
      id: 5,
      title: "The Power of AI-Driven Content Analysis",
      excerpt: "Discover how machine learning algorithms can analyze your content and provide actionable insights for better engagement.",
      author: "Sarah Johnson",
      date: "January 30, 2026",
      readTime: "8 min read",
      category: "AI Technology",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80"
    },
    {
      id: 6,
      title: "Maximizing ROI: Budget Allocation Strategies for Multi-Platform Campaigns",
      excerpt: "Expert tips on how to distribute your advertising budget across different platforms for optimal returns.",
      author: "Michael Chen",
      date: "January 28, 2026",
      readTime: "6 min read",
      category: "Strategy",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
    }
  ];

  const featuredPost = blogPosts[0];
  const regularPosts = blogPosts.slice(1);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "AI Trends":
        return "from-purple-600 to-pink-600";
      case "Marketing Tips":
        return "from-cyan-600 to-blue-600";
      case "Case Study":
        return "from-green-600 to-emerald-600";
      case "Social Media":
        return "from-orange-600 to-red-600";
      case "AI Technology":
        return "from-purple-600 to-blue-600";
      case "Strategy":
        return "from-yellow-600 to-orange-600";
      default:
        return "from-gray-600 to-gray-700";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "AI Trends":
        return <Sparkles className="w-4 h-4" />;
      case "Marketing Tips":
        return <Target className="w-4 h-4" />;
      case "Case Study":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-[#0a0e27] via-[#0f1235] to-black"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* AI Circuit Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit-blogs" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="50" cy="50" r="2" fill="#00ffff" />
              <line x1="50" y1="50" x2="100" y2="50" stroke="#00ffff" strokeWidth="0.5" />
              <line x1="50" y1="50" x2="50" y2="0" stroke="#00ffff" strokeWidth="0.5" />
              <circle cx="0" cy="50" r="2" fill="#a855f7" />
              <circle cx="50" cy="0" r="2" fill="#3b82f6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-blogs)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-12 text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl text-white bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
              VULPINIX AI Blog
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Insights, tips, and trends in AI-powered digital marketing
            </p>
          </motion.div>

          {/* Featured Post */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900/90 via-purple-900/20 to-cyan-900/20 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20 group hover:scale-[1.02] transition-transform duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto overflow-hidden">
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(featuredPost.category)} text-white text-xs flex items-center gap-1`}>
                      {getCategoryIcon(featuredPost.category)}
                      {featuredPost.category}
                    </span>
                    <span className="text-yellow-400 text-sm font-semibold">Featured</span>
                  </div>
                  <h2 className="text-3xl text-white mb-4 group-hover:text-cyan-400 transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                    <span>{featuredPost.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <Button
                    className="w-fit bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Blog Grid */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl text-white mb-6">Latest Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900/90 via-purple-900/10 to-cyan-900/10 border-2 border-purple-500/20 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all group hover:scale-105 duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-3 left-3">
                      <span className={`px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryColor(post.category)} text-white text-xs flex items-center gap-1 w-fit`}>
                        {getCategoryIcon(post.category)}
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-4 pb-4 border-b border-gray-700/50">
                      <span>{post.author}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {post.date}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 group/btn"
                      >
                        Read More
                        <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-gray-900/90 via-purple-900/30 to-cyan-900/30 border-2 border-purple-500/30 backdrop-blur-sm shadow-2xl shadow-purple-500/20"
          >
            <div className="text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/50 mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl text-white mb-4">Stay Updated</h2>
              <p className="text-gray-400 mb-6">
                Subscribe to our newsletter and get the latest insights on AI-powered marketing delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-900/50 border border-purple-500/30 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-400/50"
                />
                <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all">
                  Subscribe
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-purple-500/20 bg-gray-900/50 backdrop-blur-sm py-8 px-4 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent font-semibold">
              VULPINIX AI 1.0
            </span>
            {" "}— Automate Your Digital World
          </p>
        </div>
      </footer>
    </motion.div>
  );
}
