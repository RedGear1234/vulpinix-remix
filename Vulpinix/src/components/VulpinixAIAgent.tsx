import { useState, useEffect, useRef } from 'react';
import {
  Send, Image as ImageIcon, Loader2,
  Download, PenSquare, BarChart2, Lightbulb, Hash, Zap,
  Plus, Clock, Trash2, ChevronLeft, RefreshCw, MessageSquare
} from 'lucide-react';

// Vulpinix fox SVG — used in place of Bot icon
function VulpinixIcon({ size = 24, color = '#fff' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="15,20 45,85 55,60 35,20" fill={color} />
      <polygon points="85,20 55,85 45,60 65,20" fill={color} />
      <polygon points="40,25 60,25 50,50" fill={color} opacity="0.5" />
    </svg>
  );
}

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  /* ── Root layout ─────────────────────────────────── */
  .vai-root {
    display: flex;
    height: 100%;
    min-height: 0;
    font-family: 'Inter', sans-serif;
    position: relative;
    overflow: hidden;
  }

  /* ── History Sidebar ─────────────────────────────── */
  .vai-history-sidebar {
    width: 260px;
    flex-shrink: 0;
    border-right: 1px solid rgba(255,255,255,0.06);
    background: rgba(0,0,0,0.18);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: width 0.3s cubic-bezier(.4,0,.2,1), opacity 0.3s;
  }
  .vai-history-sidebar.collapsed {
    width: 0;
    opacity: 0;
    border-right: none;
    pointer-events: none;
  }

  .vai-history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 14px 10px;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .vai-history-title {
    font-size: 12px;
    font-weight: 700;
    color: #64748b;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .vai-new-chat-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    background: linear-gradient(135deg, #7c3aed, #2563eb);
    border: none;
    border-radius: 9px;
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    padding: 6px 11px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    box-shadow: 0 3px 10px rgba(124,58,237,0.3);
  }
  .vai-new-chat-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 16px rgba(124,58,237,0.45);
  }

  .vai-history-list {
    flex: 1;
    overflow-y: auto;
    padding: 8px 8px;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .vai-history-list::-webkit-scrollbar { width: 4px; }
  .vai-history-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 2px; }

  .vai-history-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    gap: 10px;
    color: #334155;
    font-size: 12px;
    text-align: center;
    line-height: 1.6;
  }

  .vai-history-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 10px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.18s;
    border: 1px solid transparent;
    min-width: 0;
    position: relative;
    group: true;
  }
  .vai-history-item:hover {
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.06);
  }
  .vai-history-item.active {
    background: rgba(124,58,237,0.1);
    border-color: rgba(124,58,237,0.2);
  }
  .vai-history-item-icon {
    width: 28px; height: 28px;
    border-radius: 8px;
    background: rgba(255,255,255,0.05);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    color: #475569;
  }
  .vai-history-item.active .vai-history-item-icon {
    background: rgba(124,58,237,0.15);
    color: #a78bfa;
  }
  .vai-history-item-info {
    flex: 1;
    min-width: 0;
    overflow: hidden;
  }
  .vai-history-item-title {
    font-size: 12px;
    font-weight: 600;
    color: #cbd5e1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  }
  .vai-history-item.active .vai-history-item-title {
    color: #e2e8f0;
  }
  .vai-history-item-time {
    font-size: 10px;
    color: #334155;
    margin-top: 2px;
  }
  .vai-history-delete {
    opacity: 0;
    width: 22px; height: 22px;
    border-radius: 6px;
    border: none;
    background: rgba(239,68,68,0.1);
    color: #ef4444;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
    flex-shrink: 0;
  }
  .vai-history-item:hover .vai-history-delete { opacity: 1; }
  .vai-history-delete:hover { background: rgba(239,68,68,0.25); }

  /* ── Chat column ─────────────────────────────────── */
  .vai-chat-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
    min-width: 0;
  }

  /* ── Chat toolbar ────────────────────────────────── */
  .vai-chat-toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px 8px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    flex-shrink: 0;
    background: rgba(0,0,0,0.1);
  }
  .vai-toolbar-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 9px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    color: #64748b;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.18s;
    font-family: 'Inter', sans-serif;
  }
  .vai-toolbar-btn:hover {
    background: rgba(255,255,255,0.07);
    color: #94a3b8;
    border-color: rgba(255,255,255,0.13);
  }
  .vai-toolbar-btn.active {
    background: rgba(124,58,237,0.1);
    border-color: rgba(124,58,237,0.25);
    color: #a78bfa;
  }
  .vai-refresh-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    border-radius: 9px;
    border: none;
    background: linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.15));
    color: #a78bfa;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Inter', sans-serif;
    border: 1px solid rgba(124,58,237,0.2);
    margin-left: auto;
  }
  .vai-refresh-btn:hover {
    background: linear-gradient(135deg, rgba(124,58,237,0.25), rgba(37,99,235,0.25));
    border-color: rgba(124,58,237,0.4);
    color: #c4b5fd;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(124,58,237,0.2);
  }
  .vai-refresh-btn:hover .vai-refresh-icon { animation: spin360 0.5s ease; }
  @keyframes spin360 {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .vai-refresh-icon { display: flex; align-items: center; }
  .vai-conv-name {
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 0;
  }

  /* ── Messages Area ──────────────────────────────── */
  .vai-messages {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 24px 24px 12px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .vai-messages::-webkit-scrollbar { width: 5px; }
  .vai-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }

  /* ── Empty state ─────────────────────────────────── */
  .vai-empty {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 32px 24px 12px;
    text-align: center;
  }
  .vai-empty::-webkit-scrollbar { width: 0; }
  .vai-empty-avatar {
    width: 72px; height: 72px;
    border-radius: 5px;
    background: linear-gradient(135deg, #547f44ff, #2563eb);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 20px;
    box-shadow: 0 0 0 8px rgba(124,58,237,0.1), 0 12px 30px rgba(124,58,237,0.3);
    // animation: vai-float 4s ease-in-out infinite;
  }
  @keyframes vai-float {
    0%,100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  .vai-empty-title {
    font-size: 22px; font-weight: 800; color: #f1f5f9;
    margin-bottom: 10px; letter-spacing: -0.03em;
  }
  .vai-empty-sub {
    font-size: 14px; color: #64748b; max-width: 360px;
    line-height: 1.7; margin-bottom: 36px;
  }

  /* ── Capability cards ────────────────────────────── */
  .vai-caps {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 100%;
    max-width: 560px;
  }
  .vai-cap {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 14px;
    padding: 14px 16px;
    cursor: pointer;
    transition: all 0.2s;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .vai-cap:hover {
    background: rgba(124,58,237,0.08);
    border-color: rgba(124,58,237,0.25);
    transform: translateY(-2px);
  }
  .vai-cap-icon {
    width: 32px; height: 32px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }
  .vai-cap-label {
    font-size: 13px; font-weight: 700; color: #e2e8f0;
    line-height: 1.3;
  }
  .vai-cap-desc {
    font-size: 11px; color: #64748b; line-height: 1.4;
  }

  /* ── Message rows ────────────────────────────────── */
  .vai-msg-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .vai-msg-row.vai-user { flex-direction: row-reverse; }

  .vai-msg-avatar {
    width: 34px; height: 34px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-size: 13px; font-weight: 800; color: #fff;
  }
  .vai-msg-avatar.bot-av {
    background: linear-gradient(135deg, #7c3aed, #2563eb);
    box-shadow: 0 4px 12px rgba(124,58,237,0.3);
  }
  .vai-msg-avatar.user-av {
    background: linear-gradient(135deg, #a78bfa, #38bdf8);
    box-shadow: 0 4px 12px rgba(167,139,250,0.3);
  }

  .vai-bubble {
    max-width: 72%;
    padding: 14px 18px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.65;
    color: #f1f5f9;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .vai-msg-row.vai-bot .vai-bubble {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-top-left-radius: 4px;
  }
  .vai-msg-row.vai-user .vai-bubble {
    background: linear-gradient(135deg, #6d28d9, #4f46e5);
    border-top-right-radius: 4px;
    box-shadow: 0 4px 16px rgba(109,40,217,0.3);
  }
  .vai-bold { font-weight: 700; color: #fff; }

  /* ── Generated image ─────────────────────────────── */
  .vai-img-card {
    margin-top: 12px;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
    position: relative;
    background: rgba(0,0,0,0.4);
    max-width: 320px;
  }
  .vai-img-card img { width: 100%; display: block; }
  .vai-img-save {
    position: absolute; bottom: 10px; right: 10px;
    background: rgba(0,0,0,0.65);
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255,255,255,0.15);
    color: #fff; font-size: 11px; font-weight: 700;
    padding: 6px 12px; border-radius: 20px;
    cursor: pointer; display: flex; align-items: center; gap: 5px;
    transition: all 0.2s;
  }
  .vai-img-save:hover { background: rgba(124,58,237,0.75); }

  /* ── Thinking ────────────────────────────────────── */
  .vai-thinking {
    display: flex; align-items: center; gap: 10px;
    color: #64748b; font-size: 13px; font-weight: 500;
    padding: 4px 0;
  }
  .vai-thinking-dots {
    display: flex; gap: 4px;
  }
  .vai-thinking-dots span {
    width: 6px; height: 6px; border-radius: 50%;
    background: #7c3aed;
    animation: vai-dot 1.4s ease-in-out infinite;
  }
  .vai-thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
  .vai-thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes vai-dot {
    0%,80%,100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }

  /* ── Input area ──────────────────────────────────── */
  .vai-input-section {
    flex-shrink: 0;
    padding: 14px 24px 20px;
    border-top: 1px solid rgba(255,255,255,0.05);
    background: rgba(0,0,0,0.15);
    position: relative;
  }
  .vai-input-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 18px;
    padding: 4px 6px 4px 18px;
    display: flex;
    align-items: flex-end;
    gap: 8px;
    transition: all 0.2s;
  }
  .vai-input-card:focus-within {
    border-color: rgba(124,58,237,0.5);
    background: rgba(124,58,237,0.04);
    box-shadow: 0 0 0 3px rgba(124,58,237,0.08);
  }
  .vai-textarea {
    flex: 1;
    background: none;
    border: none;
    outline: none;
    color: #f1f5f9;
    font-size: 14px;
    font-family: 'Inter', sans-serif;
    line-height: 1.6;
    resize: none;
    padding: 11px 0;
    max-height: 140px;
    min-height: 44px;
  }
  .vai-textarea::placeholder { color: #475569; }
  .vai-send {
    width: 42px; height: 42px;
    border-radius: 13px;
    background: linear-gradient(135deg, #7c3aed, #2563eb);
    border: none;
    color: #fff;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(124,58,237,0.3);
  }
  .vai-send:hover { transform: scale(1.05); box-shadow: 0 6px 18px rgba(124,58,237,0.45); }
  .vai-send:disabled {
    background: rgba(255,255,255,0.07);
    color: #334155;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  .vai-input-hint {
    font-size: 11px; color: #334155;
    text-align: center; margin-top: 10px;
    letter-spacing: 0.02em;
  }
`;

const CAPABILITIES = [
  {
    icon: <PenSquare size={16} color="#a78bfa" />,
    iconBg: 'rgba(167,139,250,0.12)',
    label: 'Write Social Posts',
    desc: 'Engaging captions for any platform',
    text: 'Write an engaging Instagram caption for a summer sale promotion with emojis and hashtags.'
  },
  {
    icon: <ImageIcon size={16} color="#38bdf8" />,
    iconBg: 'rgba(56,189,248,0.12)',
    label: 'Generate Images',
    desc: 'Create AI-powered ad creatives',
    text: 'Generate an image of a modern coffee shop with warm lighting and cozy aesthetic.'
  },
  {
    icon: <Lightbulb size={16} color="#fbbf24" />,
    iconBg: 'rgba(251,191,36,0.12)',
    label: 'Campaign Ideas',
    desc: 'Fresh ideas for your next campaign',
    text: 'Give me 3 creative campaign ideas for a fitness brand targeting Gen Z.'
  },
  {
    icon: <Hash size={16} color="#34d399" />,
    iconBg: 'rgba(52,211,153,0.12)',
    label: 'Hashtag Strategy',
    desc: 'Find the best hashtags to grow reach',
    text: 'Suggest the best 10 hashtags for a travel lifestyle brand on Instagram.'
  },
  {
    icon: <BarChart2 size={16} color="#f472b6" />,
    iconBg: 'rgba(244,114,182,0.12)',
    label: 'Analyze Performance',
    desc: 'Get tips to improve your results',
    text: 'My last campaign got 2% CTR and 10K impressions. How can I improve it?'
  },
  {
    icon: <Zap size={16} color="#fb923c" />,
    iconBg: 'rgba(251,146,60,0.12)',
    label: 'Ad Copy',
    desc: 'High-converting ad copy in seconds',
    text: 'Write a high-converting Facebook ad for a productivity app aimed at remote workers.'
  },
];

interface Message {
  id: string;
  role: 'user' | 'bot';
  text: string;
  imageUrl?: string;
}

interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  messages: Message[];
}

interface Props {
  userInitial?: string;
}

const STORAGE_KEY = 'vulpinix_ai_conversations';
const MAX_HISTORY = 30;

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function getTitle(messages: Message[]): string {
  const first = messages.find(m => m.role === 'user');
  if (!first) return 'New conversation';
  return first.text.length > 38 ? first.text.slice(0, 38) + '…' : first.text;
}

function loadConversations(): Conversation[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveConversations(convs: Conversation[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs.slice(0, MAX_HISTORY)));
  } catch {}
}

export function VulpinixAIAgent({ userInitial = 'U' }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>(() => loadConversations());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Persist conversations to localStorage whenever they change
  useEffect(() => {
    saveConversations(conversations);
  }, [conversations]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages, isTyping]);

  const autoResizeTextarea = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 140) + 'px';
    }
  };

  // Save current conversation to history
  const persistCurrentConversation = (msgs: Message[], currentId: string | null) => {
    if (msgs.length === 0) return currentId;
    const id = currentId || Date.now().toString();
    setConversations(prev => {
      const existing = prev.findIndex(c => c.id === id);
      const conv: Conversation = {
        id,
        title: getTitle(msgs),
        createdAt: existing >= 0 ? prev[existing].createdAt : Date.now(),
        messages: msgs,
      };
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = conv;
        return updated;
      }
      return [conv, ...prev];
    });
    return id;
  };

  const startNewChat = () => {
    // Save current conversation before clearing
    if (messages.length > 0) {
      persistCurrentConversation(messages, activeId);
    }
    setMessages([]);
    setActiveId(null);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const loadConversation = (conv: Conversation) => {
    // Save current first
    if (messages.length > 0 && activeId !== conv.id) {
      persistCurrentConversation(messages, activeId);
    }
    setMessages(conv.messages);
    setActiveId(conv.id);
  };

  const deleteConversation = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeId === id) {
      setMessages([]);
      setActiveId(null);
    }
  };

  const generateAIResponse = async (userText: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const systemPrompt = `You are Vulpinix AI, a sharp, creative social media marketing assistant inside the Vulpinix platform.
Help the user write posts, brainstorm campaigns, and generate images.
If they ask for an image, include [IMAGE: detailed visual prompt here] in your response on its own line.
Be concise, use emojis naturally, use **bold** for key phrases. Sound like a clever marketing expert, not a generic chatbot.`;

    if (apiKey && apiKey !== 'YOUR_GEMINI_API_KEY_HERE') {
      try {
        const history = messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [...history, { role: 'user', parts: [{ text: userText }] }]
          })
        });
        const data = await res.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } catch (e) {
        console.error('Gemini error', e);
      }
    }
    return fallbackResponse(userText);
  };

  const fallbackResponse = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('image') || lower.includes('picture') || lower.includes('photo') || lower.includes('generate')) {
      const match = text.match(/(?:image|picture|photo) of (.*)/i);
      const prompt = match ? match[1] : 'modern aesthetic social media marketing creative with vibrant colors';
      return `Sure! Here's your generated image:\n[IMAGE: ${prompt}]`;
    }
    if (lower.includes('hashtag')) {
      return '**Top hashtags for your brand:**\n\n#BrandGrowth #MarketingTips #SocialMediaStrategy #DigitalMarketing #ContentCreator #GrowYourBrand #OnlineMarketing #Trending #ViralContent #Engagement\n\nUse a mix of popular (1M+) and niche tags for the best reach! 🎯';
    }
    if (lower.includes('post') || lower.includes('caption')) {
      return "Here's a post that'll convert 🔥\n\n**\"Stop scrolling. Start growing.\"**\n\nYour brand deserves more than average results. We help founders 10x their social presence with zero guesswork.\n\nReady to grow? Drop a 💬 below!\n\n#DigitalMarketing #BrandGrowth #Marketing";
    }
    if (lower.includes('campaign') || lower.includes('idea')) {
      return "Here are **3 campaign ideas** 💡\n\n**1. 'Behind the Brand'** — Share your founding story as a 7-day reel series\n\n**2. 'User Wins'** — Repost customer success stories with a branded hashtag\n\n**3. 'Ask Me Anything'** — Live Q&A on Instagram Stories to boost engagement\n\nWant me to flesh out any of these? 🚀";
    }
    return "I'm **Vulpinix AI** — your marketing co-pilot! 🚀\n\nI can help you **write posts**, **generate images**, **brainstorm campaigns**, and more.\n\nTry asking me to write a caption or generate an image!";
  };

  const parseMessage = (rawText: string): { text: string; imageUrl?: string } => {
    const imageMatch = rawText.match(/\[IMAGE:\s*(.*?)\]/);
    if (imageMatch) {
      const prompt = imageMatch[1].trim();
      const textWithoutImage = rawText.replace(imageMatch[0], '').trim();
      const encodedPrompt = encodeURIComponent(prompt + ', high quality, aesthetic, digital art, professional');
      const seed = Math.floor(Math.random() * 100000);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=600&height=600&nologo=true&seed=${seed}`;
      return { text: textWithoutImage, imageUrl };
    }
    return { text: rawText };
  };

  const handleSend = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsTyping(true);

    const raw = await generateAIResponse(text);
    const parsed = parseMessage(raw);
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'bot',
      text: parsed.text || 'Here is your generated image!',
      imageUrl: parsed.imageUrl
    };

    const finalMessages = [...newMessages, botMsg];
    setMessages(finalMessages);
    setIsTyping(false);

    // Auto-persist after each exchange
    const newId = persistCurrentConversation(finalMessages, activeId);
    if (!activeId) setActiveId(newId ?? null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderText = (text: string) =>
    text.split('**').map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="vai-bold">{part}</strong> : part
    );

  const activeConv = conversations.find(c => c.id === activeId);

  return (
    <div className="vai-root">
      <style dangerouslySetInnerHTML={{ __html: S }} />

      {/* ── History Sidebar ── */}
      <div className={`vai-history-sidebar${historyOpen ? '' : ' collapsed'}`}>
        <div className="vai-history-header">
          <span className="vai-history-title">History</span>
          <button className="vai-new-chat-btn" onClick={startNewChat}>
            <Plus size={13} /> New Chat
          </button>
        </div>

        <div className="vai-history-list">
          {conversations.length === 0 ? (
            <div className="vai-history-empty">
              <MessageSquare size={28} color="#1e293b" />
              <span>No conversations yet.<br />Start chatting to see your history here.</span>
            </div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                className={`vai-history-item${conv.id === activeId ? ' active' : ''}`}
                onClick={() => loadConversation(conv)}
              >
                <div className="vai-history-item-icon">
                  <MessageSquare size={13} />
                </div>
                <div className="vai-history-item-info">
                  <div className="vai-history-item-title">{conv.title}</div>
                  <div className="vai-history-item-time">
                    <Clock size={9} style={{ display: 'inline', marginRight: 3 }} />
                    {timeAgo(conv.createdAt)}
                  </div>
                </div>
                <button
                  className="vai-history-delete"
                  onClick={(e) => deleteConversation(e, conv.id)}
                  title="Delete conversation"
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Chat Column ── */}
      <div className="vai-chat-col">

        {/* Toolbar */}
        <div className="vai-chat-toolbar">
          <button
            className={`vai-toolbar-btn${historyOpen ? ' active' : ''}`}
            onClick={() => setHistoryOpen(p => !p)}
            title="Toggle history"
          >
            <ChevronLeft size={13} style={{ transform: historyOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.3s' }} />
            History
          </button>

          {activeConv && (
            <span className="vai-conv-name">{activeConv.title}</span>
          )}

          <button
            className="vai-refresh-btn"
            onClick={startNewChat}
            title="Start a new conversation"
          >
            <span className="vai-refresh-icon"><RefreshCw size={13} /></span>
            New Chat
          </button>
        </div>

        {/* Messages or empty state */}
        {messages.length === 0 && !isTyping ? (
          <div className="vai-empty">
            <div className="vai-empty-avatar">
              <VulpinixIcon size={60} color="#fff" />
            </div>
            <div className="vai-empty-title">Vulpinix AI Agent</div>
            <div className="vai-empty-sub">
              Your AI marketing co-pilot. Ask me anything or pick a quick action below.
            </div>
            <div className="vai-caps">
              {CAPABILITIES.map((cap, i) => (
                <div key={i} className="vai-cap" onClick={() => handleSend(cap.text)}>
                  <div className="vai-cap-icon" style={{ background: cap.iconBg }}>{cap.icon}</div>
                  <div className="vai-cap-label">{cap.label}</div>
                  <div className="vai-cap-desc">{cap.desc}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="vai-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`vai-msg-row vai-${msg.role}`}>
                <div className={`vai-msg-avatar ${msg.role === 'bot' ? 'bot-av' : 'user-av'}`}>
                  {msg.role === 'bot' ? <VulpinixIcon size={18} color="#fff" /> : userInitial}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {msg.text && (
                    <div className="vai-bubble">{renderText(msg.text)}</div>
                  )}
                  {msg.imageUrl && (
                    <div className="vai-img-card">
                      <img src={msg.imageUrl} alt="AI Generated" />
                      <button className="vai-img-save" onClick={() => window.open(msg.imageUrl, '_blank')}>
                        <Download size={11} /> Save Image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="vai-msg-row vai-bot">
                <div className="vai-msg-avatar bot-av"><VulpinixIcon size={18} color="#fff" /></div>
                <div className="vai-thinking">
                  <div className="vai-thinking-dots">
                    <span /><span /><span />
                  </div>
                  <span>Thinking…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input */}
        <div className="vai-input-section">
          <div className="vai-input-card">
            <textarea
              ref={textareaRef}
              className="vai-textarea"
              placeholder="Ask Vulpinix AI anything…"
              value={input}
              rows={1}
              onChange={e => { setInput(e.target.value); autoResizeTextarea(); }}
              onKeyDown={handleKeyDown}
            />
            <button className="vai-send" disabled={!input.trim() || isTyping} onClick={() => handleSend()}>
              {isTyping ? <Loader2 size={18} className="lucide-spin" /> : <Send size={17} />}
            </button>
          </div>
          <div className="vai-input-hint">Press Enter to send · Shift+Enter for new line</div>
        </div>

      </div>
    </div>
  );
}
