import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { ArrowLeft, BookOpen, Calendar, Clock, ArrowRight, TrendingUp, Sparkles, Target } from "lucide-react";
import { Footer } from "../components/Footer";

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
        return "#a78bfa";
      case "Marketing Tips":
        return "#38bdf8";
      case "Case Study":
        return "#4ade80";
      case "Social Media":
        return "#fb923c";
      case "AI Technology":
        return "#818cf8";
      case "Strategy":
        return "#facc15";
      default:
        return "#9ca3af";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "AI Trends":
      case "AI Technology":
        return <Sparkles size={14} />;
      case "Marketing Tips":
        return <Target size={14} />;
      case "Case Study":
        return <TrendingUp size={14} />;
      default:
        return <BookOpen size={14} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ background: "#080b14", minHeight: "100vh", position: "relative", zIndex: 1, fontFamily: "var(--inter, 'Inter', sans-serif)" }}
    >
      <div style={{ position: "relative", zIndex: 10, maxWidth: 1280, margin: "0 auto", padding: "60px 24px 100px" }}>
        
        {/* Header / Back Button */}
        <button
          onClick={() => navigate("/")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none",
            color: "var(--vx-text-muted)", fontSize: 14, fontWeight: 600, cursor: "pointer",
            marginBottom: 60, transition: "color 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--vx-text-primary)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--vx-text-muted)"}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        <div className="vx-reveal" style={{ textAlign: "center", marginBottom: 80 }}>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 20, background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", marginBottom: 24, boxShadow: "var(--vx-shadow-card)" }}>
            <BookOpen size={28} style={{ color: "var(--vx-text-primary)" }} />
          </div>
          <h1 className="vx-heading" style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 16, letterSpacing: "-0.03em" }}>
            VULPINIX <span style={{ color: "var(--vx-text-secondary)" }}>Blog</span>
          </h1>
          <p style={{ fontSize: "1.1rem", color: "var(--vx-text-secondary)", maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Insights, strategies, and deep dives into AI-powered marketing and content automation.
          </p>
        </div>

        {/* Featured Post */}
        <div className="vx-reveal vx-delay-1" style={{ marginBottom: 80 }}>
          <div
            onClick={() => navigate(`/blogs/${featuredPost.id}`)}
            style={{
              background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 32,
              overflow: "hidden", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              boxShadow: "var(--vx-shadow-card)", transition: "transform 0.4s ease, border-color 0.4s ease",
              cursor: "pointer"
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = "var(--vx-border-hover)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--vx-border)"; }}
          >
            <div style={{ position: "relative", minHeight: 320 }}>
              <img src={featuredPost.image} alt={featuredPost.title} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent, var(--vx-bg-card))" }} className="hidden md:block" />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, var(--vx-bg-card), transparent)" }} className="block md:hidden" />
            </div>
            <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <span style={{ padding: "6px 14px", borderRadius: 999, background: "var(--vx-bg-input)", border: `1px solid ${getCategoryColor(featuredPost.category)}40`, color: getCategoryColor(featuredPost.category), fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                  {getCategoryIcon(featuredPost.category)}
                  {featuredPost.category}
                </span>
                <span style={{ color: "#facc15", fontSize: 12, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>Featured</span>
              </div>
              <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 16, lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                {featuredPost.title}
              </h2>
              <p style={{ fontSize: 16, color: "var(--vx-text-secondary)", lineHeight: 1.6, marginBottom: 32 }}>
                {featuredPost.excerpt}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, fontSize: 13, color: "var(--vx-text-muted)", fontWeight: 500, marginBottom: 32 }}>
                <span>{featuredPost.author}</span>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--vx-border-focus)" }} />
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={14} /> {featuredPost.date}</span>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--vx-border-focus)" }} />
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Clock size={14} /> {featuredPost.readTime}</span>
              </div>
              <div>
                <button
                  style={{
                    padding: "14px 28px", background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)",
                    borderRadius: 12, border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.3s ease"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.opacity = "0.9"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.opacity = "1"; }}
                >
                  Read Article <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Regular Posts Grid */}
        <div className="vx-reveal vx-delay-2">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: "var(--vx-text-primary)" }}>Latest Articles</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {regularPosts.map((post, i) => (
              <div
                key={post.id}
                onClick={() => navigate(`/blogs/${post.id}`)}
                style={{
                  background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 24,
                  overflow: "hidden", display: "flex", flexDirection: "column", transition: "all 0.3s ease",
                  cursor: "pointer"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = "var(--vx-border-hover)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "var(--vx-border)"; }}
              >
                <div style={{ height: 200, position: "relative", overflow: "hidden" }}>
                  <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease" }} />
                  <div style={{ position: "absolute", top: 16, left: 16 }}>
                    <span style={{ padding: "4px 12px", borderRadius: 999, background: "var(--vx-bg-nav)", backdropFilter: "blur(8px)", border: "1px solid var(--vx-border)", color: getCategoryColor(post.category), fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                      {getCategoryIcon(post.category)} {post.category}
                    </span>
                  </div>
                </div>
                <div style={{ padding: "24px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--vx-text-primary)", marginBottom: 12, lineHeight: 1.4, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--vx-text-secondary)", lineHeight: 1.6, marginBottom: 20, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", flex: 1 }}>
                    {post.excerpt}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 20, borderTop: "1px solid var(--vx-border)", color: "var(--vx-text-muted)", fontSize: 12, fontWeight: 500 }}>
                    <span>{post.date}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {post.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="vx-reveal vx-delay-3" style={{ marginTop: 80 }}>
          <div style={{ background: "var(--vx-bg-card)", border: "1px solid var(--vx-border)", borderRadius: 32, padding: "60px 24px", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", height: "100%", background: "radial-gradient(circle, rgba(99,51,255,0.05) 0%, transparent 60%)", pointerEvents: "none" }} />
            
            <div style={{ position: "relative", zIndex: 2, maxWidth: 500, margin: "0 auto" }}>
              <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 56, height: 56, borderRadius: 16, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", marginBottom: 20 }}>
                <Sparkles size={24} style={{ color: "var(--vx-text-primary)" }} />
              </div>
              <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.4rem)", fontWeight: 800, color: "var(--vx-text-primary)", marginBottom: 16, letterSpacing: "-0.02em" }}>
                Stay Ahead of the Curve
              </h2>
              <p style={{ fontSize: 15, color: "var(--vx-text-secondary)", marginBottom: 32, lineHeight: 1.6 }}>
                Join thousands of marketers receiving our weekly insights on AI-powered content strategies and automation.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  style={{ flex: 1, padding: "14px 20px", borderRadius: 12, background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", color: "var(--vx-text-primary)", fontSize: 15, outline: "none", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "var(--vx-border-focus)"}
                  onBlur={e => e.target.style.borderColor = "var(--vx-border)"}
                />
                <button
                  style={{ padding: "14px 28px", background: "var(--vx-text-primary)", color: "var(--vx-bg-primary)", borderRadius: 12, border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer", transition: "all 0.3s ease", whiteSpace: "nowrap" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.opacity = "0.9"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.opacity = "1"; }}
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
      
      <Footer />
    </motion.div>
  );
}
