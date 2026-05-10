import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { ArrowLeft, Calendar, Clock, Share2, Twitter, Linkedin, Facebook } from "lucide-react";
import { Footer } from "../components/Footer";
import { useEffect } from "react";

export default function ArticlePage() {
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock content for the article
  const article = {
    title: "The Future of AI in Digital Marketing: Trends to Watch in 2026",
    category: "AI Trends",
    date: "February 10, 2026",
    readTime: "5 min read",
    author: "Sarah Johnson",
    authorRole: "Head of AI Strategy",
    authorImage: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=a78bfa&color=fff",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80",
    content: `
      Artificial Intelligence is no longer just a buzzword; it's the foundational technology driving the next generation of digital marketing. As we move deeper into 2026, the landscape is shifting from simple automation to intelligent, predictive, and autonomous marketing ecosystems.

      Here are the top trends shaping the future:

      ### 1. Autonomous Campaign Management
      Gone are the days of manual A/B testing and budget reallocation. Modern AI platforms now autonomously manage entire campaigns, optimizing bids, targeting, and even creative elements in real-time. This allows marketing teams to focus on high-level strategy rather than getting bogged down in platform nuances.

      ### 2. Hyper-Personalization at Scale
      Consumers expect personalized experiences. AI models can now analyze thousands of data points instantly to deliver hyper-personalized content, product recommendations, and messaging to individual users, significantly boosting conversion rates.

      ### 3. Generative AI for Content Creation
      The capabilities of generative AI have expanded exponentially. From drafting compelling ad copy and blog posts to generating high-quality images and video snippets, AI is becoming the ultimate co-creator for marketing teams.

      ### 4. Predictive Audience Analytics
      Understanding what your audience will do before they do it is the holy grail of marketing. Predictive analytics use historical data to forecast trends, identify potential churn, and uncover entirely new audience segments that you may have missed.

      ### Conclusion
      The integration of AI into digital marketing is creating unprecedented opportunities for brands to connect with their audiences. Those who embrace these technologies will find themselves with a significant competitive advantage in the years to come.
    `
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      style={{ background: "var(--vx-bg-primary)", minHeight: "100vh", position: "relative", zIndex: 1, fontFamily: "var(--inter, 'Inter', sans-serif)" }}
    >
      <div style={{ position: "relative", zIndex: 10, maxWidth: 800, margin: "0 auto", padding: "60px 24px 100px" }}>
        
        {/* Back Button */}
        <button
          onClick={() => navigate("/blogs")}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none",
            color: "var(--vx-text-muted)", fontSize: 14, fontWeight: 600, cursor: "pointer",
            marginBottom: 40, transition: "color 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--vx-text-primary)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--vx-text-muted)"}
        >
          <ArrowLeft size={16} />
          Back to Blogs
        </button>

        {/* Article Header */}
        <div className="vx-reveal" style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ padding: "6px 14px", borderRadius: 999, background: "var(--vx-bg-input)", border: "1px solid rgba(167, 139, 250, 0.4)", color: "#a78bfa", fontSize: 12, fontWeight: 700 }}>
              {article.category}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--vx-text-muted)", fontSize: 13, fontWeight: 500 }}>
              <Calendar size={14} /> {article.date}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--vx-text-muted)", fontSize: 13, fontWeight: 500 }}>
              <Clock size={14} /> {article.readTime}
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", fontWeight: 800, color: "var(--vx-text-primary)", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 32 }}>
            {article.title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24, padding: "24px 0", borderTop: "1px solid var(--vx-border)", borderBottom: "1px solid var(--vx-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src={article.authorImage} alt={article.author} style={{ width: 48, height: 48, borderRadius: "50%" }} />
              <div>
                <div style={{ color: "var(--vx-text-primary)", fontWeight: 700, fontSize: 15 }}>{article.author}</div>
                <div style={{ color: "var(--vx-text-muted)", fontSize: 13 }}>{article.authorRole}</div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: "var(--vx-text-muted)", fontSize: 13, fontWeight: 500, marginRight: 8 }}>Share</span>
              <button style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vx-text-primary)", cursor: "pointer" }}><Twitter size={16} /></button>
              <button style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vx-text-primary)", cursor: "pointer" }}><Linkedin size={16} /></button>
              <button style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vx-text-primary)", cursor: "pointer" }}><Facebook size={16} /></button>
              <button style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--vx-bg-input)", border: "1px solid var(--vx-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--vx-text-primary)", cursor: "pointer" }}><Share2 size={16} /></button>
            </div>
          </div>
        </div>

        {/* Article Image */}
        <div className="vx-reveal vx-delay-1" style={{ width: "100%", height: 400, borderRadius: 24, overflow: "hidden", marginBottom: 60, border: "1px solid var(--vx-border)" }}>
          <img src={article.image} alt="Article cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>

        {/* Article Content */}
        <div className="vx-reveal vx-delay-2" style={{ color: "var(--vx-text-secondary)", fontSize: "1.1rem", lineHeight: 1.8 }}>
          {article.content.split("\n\n").map((paragraph, index) => {
            if (paragraph.trim().startsWith("###")) {
              return (
                <h3 key={index} style={{ color: "var(--vx-text-primary)", fontSize: "1.5rem", fontWeight: 800, marginTop: 48, marginBottom: 16 }}>
                  {paragraph.replace("###", "").trim()}
                </h3>
              );
            }
            return (
              <p key={index} style={{ marginBottom: 24 }}>
                {paragraph.trim()}
              </p>
            );
          })}
        </div>
      </div>
      
      <Footer />
    </motion.div>
  );
}
