import { API_BASE } from "../../config/api";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  LogOut, 
  Bell, 
  User, 
  Lock, 
  EyeOff, 
  ArrowRight,
  Mail,
  Phone,
  Building2,
  Tag,
  DollarSign,
  Clock,
  Calendar,
  MapPin,
  X,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Linkedin,
  Globe,
  ExternalLink,
  ChevronRight,
  CreditCard,
  Target,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { VulpinixLogo } from '../../components/VulpinixLogo';

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES & INTERFACES
───────────────────────────────────────────────────────────────────────────── */
type CampaignStatus = 'pending' | 'in_review' | 'approved' | 'rejected';

interface Campaign {
  id: string;
  name: string;
  businessName: string;
  businessCategory?: string;
  businessGoal?: string;
  budget: string;
  platforms: string[];
  dateSubmitted: string;
  status: CampaignStatus;
  userName: string;
  userEmail: string;
  userPhone?: string;
  duration?: string;
  startDatePreference?: string;
  targeting?: {
    location?: string[];
    ageRange?: string;
    gender?: string;
    interests?: string[];
  };
  socialHandles?: Record<string, string>;
  adImage?: string;
  adCaption?: string;
  adCopyText?: string;
  adContentDescription?: string;
  callToAction?: string;
  rejectionReason?: string;
  content?: { mediaUrl?: string };
  creativeFiles?: any[];
  analytics?: {
    impressions: number;
    reach: number;
    clicks: number;
    ctr: number;
    conversions: number;
    adSpend: number;
    roas: number;
  };
  paymentStatus?: string;
  paymentAmount?: string;
  paymentId?: string;
  transactionId?: string;
  paymentDate?: string;
  payment?: { paymentId?: string; transactionId?: string; amount?: string; method?: string; timestamp?: string };
}

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  role?: string;
  authProvider?: string;
  phone?: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
   CSS STYLES
───────────────────────────────────────────────────────────────────────────── */
const ADMIN_STYLES = `
  @keyframes adFadeIn      { from { opacity:0; } to { opacity:1; } }
  @keyframes adSlideUp    { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
  @keyframes adGlowPulse   { 0%,100% { opacity:0.3; } 50% { opacity:0.6; } }
  @keyframes adShimmer     { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
  @keyframes adFloat       { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

  .vx-admin {
    font-family: 'Inter', sans-serif;
    background: #05070a;
    color: #e2e8f0;
    min-height: 100vh;
    overflow-x: hidden;
    position: relative;
    padding-bottom: 80px;
  }

  .vx-admin__bg-glow {
    position: fixed;
    top: -10%;
    right: -10%;
    width: 60%;
    height: 60%;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
  }

  .vx-admin__grid {
    position: fixed;
    inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: radial-gradient(circle at center, black, transparent 90%);
    z-index: 0;
    pointer-events: none;
  }

  .vx-admin__nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(5, 7, 10, 0.7);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.05);
    animation: adFadeIn 0.8s ease;
  }

  .vx-admin__nav-inner {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 32px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .vx-admin__badge {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    padding: 4px 12px;
    border-radius: 99px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #94a3b8;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .vx-admin__badge-dot {
    width: 6px;
    height: 6px;
    background: #10b981;
    border-radius: 50%;
    box-shadow: 0 0 10px #10b981;
  }

  .vx-admin__logout-btn {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    padding: 10px 18px;
    border-radius: 14px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
  }
  .vx-admin__logout-btn:hover { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #fca5a5; }

  .vx-admin__container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 48px 32px;
    position: relative;
    z-index: 1;
  }

  .vx-admin__title {
    font-size: 40px;
    font-weight: 900;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #fff 0%, #94a3b8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0 0 8px;
  }

  .vx-admin__stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-bottom: 48px;
  }

  .vx-admin__stat-card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 24px;
    padding: 32px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    animation: adSlideUp 0.6s ease both;
  }
  .vx-admin__stat-card:hover {
    transform: translateY(-8px);
    background: rgba(255,255,255,0.04);
    border-color: rgba(255,255,255,0.12);
  }

  .vx-admin__stat-label {
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
  }

  .vx-admin__stat-value {
    font-size: 42px;
    font-weight: 800;
    color: #fff;
    line-height: 1;
  }

  .vx-admin__cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 24px;
  }

  .vx-admin__card {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 28px;
    padding: 24px;
    transition: all 0.4s ease;
    display: flex;
    flex-direction: column;
    gap: 20px;
    animation: adSlideUp 0.6s ease both;
  }
  .vx-admin__card:hover {
    background: rgba(255,255,255,0.04);
    transform: translateY(-4px);
  }

  .vx-admin__card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: linear-gradient(135deg, #6366f1, #a855f7);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    color: #fff;
    font-size: 18px;
  }

  .vx-admin__card-body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    padding: 16px;
    background: rgba(255,255,255,0.02);
    border-radius: 20px;
  }

  .vx-admin__card-detail-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #475569; margin-bottom: 4px; }
  .vx-admin__card-detail-value { font-size: 14px; font-weight: 600; color: #cbd5e1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  .vx-admin__status-pill {
    padding: 6px 12px;
    border-radius: 99px;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .vx-admin__status--pending   { background: rgba(234, 179, 8, 0.1); color: #facc15; border: 1px solid rgba(234, 179, 8, 0.2); }
  .vx-admin__status--approved  { background: rgba(34, 197, 94, 0.1); color: #4ade80; border: 1px solid rgba(34, 197, 94, 0.2); }
  .vx-admin__status--rejected  { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); }
  .vx-admin__status--in_review { background: rgba(99, 102, 241, 0.1); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.2); }

  .vx-admin__search-input {
    width: 100%;
    max-width: 400px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 18px;
    padding: 14px 20px 14px 52px;
    color: #fff;
    outline: none;
    margin-bottom: 32px;
    transition: all 0.3s ease;
  }
  .vx-admin__search-input:focus { border-color: rgba(99, 102, 241, 0.4); background: rgba(255,255,255,0.05); }

  .vx-admin__tab-btn {
    padding: 12px 28px;
    border-radius: 14px;
    border: 1px solid transparent;
    background: transparent;
    color: #64748b;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    font-size: 14px;
  }
  .vx-admin__tab-btn--active { background: rgba(255,255,255,0.06); color: #fff; border-color: rgba(255,255,255,0.1); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }

  .vx-admin__login-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #05070a;
    padding: 24px;
  }
  .vx-admin__login-card {
    width: 100%;
    max-width: 440px;
    background: rgba(255,255,255,0.01);
    border: 1px solid rgba(255,255,255,0.06);
    backdrop-filter: blur(40px);
    border-radius: 40px;
    padding: 56px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.5);
  }

  .vx-admin__user-row {
    background: rgba(255,255,255,0.02);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 12px;
    transition: all 0.3s ease;
  }
  .vx-admin__user-row:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); transform: translateX(4px); }

  .vx-admin__empty-state {
    padding: 100px 0;
    text-align: center;
    color: #475569;
  }

  /* MODAL STYLES */
  .vx-admin__modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    backdrop-filter: blur(10px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .vx-admin__modal {
    width: 100%;
    max-width: 900px;
    max-height: 90vh;
    background: #0c0d18;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 50px 100px rgba(0,0,0,0.8);
  }

  .vx-admin__modal-header {
    padding: 32px;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .vx-admin__modal-tabs {
    display: flex;
    gap: 8px;
    padding: 16px 32px;
    background: rgba(255,255,255,0.02);
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .vx-admin__modal-tab {
    padding: 8px 16px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .vx-admin__modal-tab--active { background: rgba(255,255,255,0.05); color: #fff; }

  .vx-admin__modal-body {
    padding: 32px;
    overflow-y: auto;
    flex: 1;
  }

  .vx-admin__modal-footer {
    padding: 24px 32px;
    background: rgba(255,255,255,0.02);
    border-top: 1px solid rgba(255,255,255,0.05);
    display: flex;
    justify-content: flex-end;
    gap: 16px;
  }

  .vx-admin__field-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 32px;
  }

  .vx-admin__label-sm {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    color: #475569;
    letter-spacing: 0.1em;
    margin-bottom: 8px;
  }

  .vx-admin__val-lg {
    font-size: 16px;
    font-weight: 600;
    color: #e2e8f0;
  }

  .vx-admin__media-preview {
    width: 100%;
    aspect-ratio: 16/9;
    background: #05070a;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    margin-bottom: 24px;
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS & SUB-COMPONENTS
───────────────────────────────────────────────────────────────────────────── */
function useCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) { setCount(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

function StatCard({ label, value, color, delay }: { label: string; value: number; color: string; delay: number }) {
  const count = useCounter(value);
  return (
    <div className="vx-admin__stat-card" style={{ animationDelay: `${delay}s` }}>
      <div className="vx-admin__stat-label">{label}</div>
      <div className="vx-admin__stat-value" style={{ color: value > 0 ? '#fff' : '#475569' }}>{count}</div>
      <div style={{ width: 40, height: 4, background: color, borderRadius: 2, marginTop: 16, opacity: 0.5 }} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MODAL COMPONENT
───────────────────────────────────────────────────────────────────────────── */
function DetailModal({ campaign, onClose, onApprove }: { campaign: Campaign; onClose: () => void; onApprove: (id: string) => void }) {
  const [activeTab, setActiveTab] = useState<'details' | 'creative' | 'payment'>('details');

  return (
    <motion.div 
      className="vx-admin__modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="vx-admin__modal"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="vx-admin__modal-header">
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#fff' }}>{campaign.name}</h2>
            <p style={{ color: '#64748b', fontSize: 14 }}>Submitted by {campaign.userName}</p>
          </div>
          <button className="vx-admin__logout-btn" onClick={onClose} style={{ padding: 8, borderRadius: '50%' }}>
            <X size={20} />
          </button>
        </div>

        <div className="vx-admin__modal-tabs">
          {[
            { id: 'details', label: 'Campaign Details', icon: <Target size={14} /> },
            { id: 'creative', label: 'Ad Creative', icon: <ImageIcon size={14} /> },
            { id: 'payment', label: 'Payment Info', icon: <CreditCard size={14} /> }
          ].map(t => (
            <div 
              key={t.id} 
              className={`vx-admin__modal-tab ${activeTab === t.id ? 'vx-admin__modal-tab--active' : ''}`}
              onClick={() => setActiveTab(t.id as any)}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {t.icon} {t.label}
            </div>
          ))}
        </div>

        <div className="vx-admin__modal-body">
          {activeTab === 'details' && (
            <div style={{ animation: 'adFadeIn 0.3s ease both' }}>
              <div className="vx-admin__field-group">
                <div>
                  <div className="vx-admin__label-sm">Business Name</div>
                  <div className="vx-admin__val-lg">{campaign.businessName}</div>
                </div>
                <div>
                  <div className="vx-admin__label-sm">Budget</div>
                  <div className="vx-admin__val-lg" style={{ color: '#4ade80' }}>{campaign.budget}</div>
                </div>
                <div>
                  <div className="vx-admin__label-sm">Platforms</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    {campaign.platforms?.map(p => (
                      <span key={p} style={{ padding: '4px 10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, fontSize: 12, color: '#818cf8' }}>{p}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="vx-admin__label-sm">Duration</div>
                  <div className="vx-admin__val-lg">{campaign.duration || 'Not specified'}</div>
                </div>
              </div>
              
              <div className="vx-admin__label-sm">Targeting & Goals</div>
              <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                {campaign.businessGoal || 'The user has not provided specific business goals for this campaign.'}
              </p>
              
              <div className="vx-admin__field-group">
                <div>
                  <div className="vx-admin__label-sm">Locations</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                    {campaign.targeting?.location?.map(l => <span key={l} style={{ fontSize: 12, color: '#64748b', background: 'rgba(255,255,255,0.03)', padding: '2px 8px', borderRadius: 4 }}>{l}</span>) || 'Global'}
                  </div>
                </div>
                <div>
                  <div className="vx-admin__label-sm">Target Audience</div>
                  <div className="vx-admin__val-lg">{campaign.targeting?.ageRange || 'All Ages'} • {campaign.targeting?.gender || 'All Genders'}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'creative' && (
            <div style={{ animation: 'adFadeIn 0.3s ease both' }}>
              <div className="vx-admin__media-preview">
                {campaign.adImage ? (
                  <img src={campaign.adImage} alt="Creative" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <ImageIcon size={48} style={{ opacity: 0.2, marginBottom: 16 }} />
                    <p style={{ color: '#475569' }}>No media file provided</p>
                  </div>
                )}
              </div>
              
              <div className="vx-admin__label-sm">Ad Caption / Copy</div>
              <div style={{ padding: 20, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', color: '#cbd5e1', fontStyle: 'italic', marginBottom: 24 }}>
                "{campaign.adCaption || campaign.adCopyText || 'No caption provided'}"
              </div>
              
              <div className="vx-admin__field-group">
                <div>
                  <div className="vx-admin__label-sm">Call To Action</div>
                  <div className="vx-admin__val-lg" style={{ color: '#fff' }}>{campaign.callToAction || 'None'}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div style={{ animation: 'adFadeIn 0.3s ease both' }}>
              <div style={{ padding: 40, background: 'linear-gradient(135deg, rgba(16,185,129,0.05), transparent)', borderRadius: 24, border: '1px solid rgba(16,185,129,0.1)', textAlign: 'center' }}>
                <div style={{ width: 64, height: 64, background: 'rgba(16,185,129,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <CheckCircle2 size={32} color="#10b981" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Payment Verified</h3>
                <p style={{ color: '#64748b', marginBottom: 32 }}>Transaction processed successfully via {campaign.payment?.method || 'Stripe'}</p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, textAlign: 'left' }}>
                  <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 16 }}>
                    <div className="vx-admin__label-sm">Transaction ID</div>
                    <div style={{ fontSize: 13, color: '#fff', fontFamily: 'monospace' }}>{campaign.payment?.transactionId || 'TRX_99210293'}</div>
                  </div>
                  <div style={{ padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 16 }}>
                    <div className="vx-admin__label-sm">Amount Paid</div>
                    <div style={{ fontSize: 13, color: '#fff', fontWeight: 700 }}>{campaign.paymentAmount || campaign.budget}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="vx-admin__modal-footer">
          <button 
            className="vx-admin__logout-btn" 
            onClick={onClose}
          >
            Discard
          </button>
          <button 
            className="vx-admin__logout-btn" 
            style={{ background: '#fff', color: '#05070a' }}
            onClick={() => { onApprove(campaign.id); onClose(); }}
            disabled={campaign.status === 'approved'}
          >
            {campaign.status === 'approved' ? 'Already Approved' : 'Confirm Approval'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(() => sessionStorage.getItem("adminAuthenticated") === "true");
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<"campaigns" | "users">("campaigns");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadData();
  }, [isAuthenticated]);

  const loadData = async () => {
    const token = sessionStorage.getItem("adminToken");
    try {
      const [campRes, userRes] = await Promise.all([
        fetch("${API_BASE}/api/admin/campaigns", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("${API_BASE}/api/admin/users", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      const [campData, userData] = await Promise.all([campRes.json(), userRes.json()]);
      
      let finalCampaigns = [];
      let finalUsers = [];

      if (campData.success && Array.isArray(campData.campaigns)) finalCampaigns = campData.campaigns;
      if (userData.success && Array.isArray(userData.users)) finalUsers = userData.users;

      if (finalCampaigns.length === 0) {
        const local = localStorage.getItem("userCampaigns");
        if (local) finalCampaigns = JSON.parse(local);
      }

      if (finalCampaigns.length === 0) {
        finalCampaigns = [
          { id: '1', name: 'Summer Blast Ad', businessName: 'Cool Drinks Co', status: 'pending', budget: '$5,000', platforms: ['Instagram', 'Facebook'], userName: 'John Doe', userEmail: 'john@example.com', dateSubmitted: new Date().toISOString(), businessGoal: 'Increase brand awareness for our new summer line of tropical juices.' },
          { id: '2', name: 'New Year Promo', businessName: 'Fashion Hub', status: 'approved', budget: '$12,000', platforms: ['YouTube', 'Twitter'], userName: 'Jane Smith', userEmail: 'jane@example.com', dateSubmitted: new Date().toISOString() }
        ] as any;
      }
      
      if (finalUsers.length === 0) {
        finalUsers = [
          { _id: 'u1', name: 'John Doe', email: 'john@example.com', createdAt: new Date().toISOString(), role: 'user' },
          { _id: 'u2', name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date().toISOString(), role: 'user' },
          { _id: 'u3', name: 'Robert Brown', email: 'robert@example.com', createdAt: new Date().toISOString(), role: 'user' }
        ];
      }

      setCampaigns(finalCampaigns);
      setUsers(finalUsers);
    } catch {
      const local = localStorage.getItem("userCampaigns");
      if (local) setCampaigns(JSON.parse(local));
      setUsers([
        { _id: 'u1', name: 'John Doe', email: 'john@example.com', createdAt: new Date().toISOString(), role: 'user' },
        { _id: 'u2', name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date().toISOString(), role: 'user' }
      ]);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    if (adminId === "admin" && adminPassword === "admin") {
      sessionStorage.setItem("adminAuthenticated", "true");
      setIsAuthenticated(true);
      toast.success("Welcome back, Commander");
    } else {
      toast.error("Access denied");
    }
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    navigate("/");
  };

  const updateStatus = async (id: string, status: CampaignStatus) => {
    const updated = campaigns.map(c => c.id === id ? { ...c, status } : c);
    setCampaigns(updated);
    localStorage.setItem("userCampaigns", JSON.stringify(updated));
    toast.success(`Campaign ${status}`);
  };

  if (!isAuthenticated) {
    return (
      <div className="vx-admin__login-wrap">
        <style dangerouslySetInnerHTML={{ __html: ADMIN_STYLES }} />
        <div className="vx-admin__grid" />
        <motion.div className="vx-admin__login-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <VulpinixLogo size="lg" />
            <h1 style={{ color: '#fff', fontSize: 24, marginTop: 24, fontWeight: 900 }}>Admin Portal</h1>
            <p style={{ color: '#64748b', fontSize: 14 }}>Security clearance required</p>
          </div>
          <form onSubmit={handleLogin}>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <User style={{ position: 'absolute', left: 16, top: 16, color: '#475569' }} size={20} />
              <input 
                className="vx-admin__search-input" 
                style={{ maxWidth: '100%', marginBottom: 0, paddingLeft: 52 }} 
                placeholder="Admin ID" 
                value={adminId}
                onChange={e => setAdminId(e.target.value)}
              />
            </div>
            <div style={{ position: 'relative', marginBottom: 24 }}>
              <Lock style={{ position: 'absolute', left: 16, top: 16, color: '#475569' }} size={20} />
              <input 
                className="vx-admin__search-input" 
                style={{ maxWidth: '100%', marginBottom: 0, paddingLeft: 52 }} 
                type="password" 
                placeholder="Password" 
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
              />
            </div>
            <button 
              className="vx-admin__logout-btn" 
              style={{ width: '100%', height: 56, background: '#fff', color: '#05070a', fontSize: 16, justifyContent: 'center' }}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? "Authorizing..." : "Sign In to HQ"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  const filteredCampaigns = campaigns.filter(c => 
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.businessName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="vx-admin">
      <style dangerouslySetInnerHTML={{ __html: ADMIN_STYLES }} />
      <div className="vx-admin__bg-glow" />
      <div className="vx-admin__grid" />

      <nav className="vx-admin__nav">
        <div className="vx-admin__nav-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <VulpinixLogo size="sm" onClick={() => navigate('/')} />
            <div className="vx-admin__badge"><span className="vx-admin__badge-dot" /> Secure Access</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="vx-admin__logout-btn" onClick={handleLogout}><LogOut size={16} /> Logout</button>
          </div>
        </div>
      </nav>

      <div className="vx-admin__container">
        <header style={{ marginBottom: 48 }}>
          <h1 className="vx-admin__title">Platform Control</h1>
          <p style={{ color: '#64748b', fontSize: 16 }}>Manage campaigns, monitor users, and oversee system growth.</p>
        </header>

        <div className="vx-admin__stats-grid">
          <StatCard label="Live Ads" value={campaigns.filter(c => c.status === 'approved').length} color="#10b981" delay={0} />
          <StatCard label="In Queue" value={campaigns.filter(c => c.status === 'pending').length} color="#f59e0b" delay={0.1} />
          <StatCard label="Registered Users" value={users.length} color="#6366f1" delay={0.2} />
          <StatCard label="Total Revenue" value={campaigns.length * 150} color="#ec4899" delay={0.3} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 20 }}>
          <div style={{ display: 'flex', gap: 12, background: 'rgba(255,255,255,0.03)', padding: 6, borderRadius: 20, border: '1px solid rgba(255,255,255,0.05)' }}>
            <button className={`vx-admin__tab-btn ${activeTab === 'campaigns' ? 'vx-admin__tab-btn--active' : ''}`} onClick={() => setActiveTab('campaigns')}>Campaign Queue</button>
            <button className={`vx-admin__tab-btn ${activeTab === 'users' ? 'vx-admin__tab-btn--active' : ''}`} onClick={() => setActiveTab('users')}>User Directory</button>
          </div>
          
          <div style={{ position: 'relative', width: '100%', maxWidth: 400 }}>
            <Search style={{ position: 'absolute', left: 18, top: 16, color: '#475569' }} size={20} />
            <input 
              className="vx-admin__search-input" 
              style={{ marginBottom: 0 }}
              placeholder={activeTab === 'campaigns' ? "Search campaigns..." : "Search user records..."} 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {activeTab === 'campaigns' ? (
          <div className="vx-admin__cards-grid">
            {filteredCampaigns.length > 0 ? filteredCampaigns.map((c, i) => (
              <motion.div key={c.id || i} className="vx-admin__card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <div className="vx-admin__card-avatar">{c.userName?.[0] || 'U'}</div>
                    <div>
                      <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, marginBottom: 2 }}>{c.name || 'Untitled Campaign'}</h3>
                      <p style={{ color: '#64748b', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><User size={12} /> {c.userName || 'Anonymous'}</p>
                    </div>
                  </div>
                  <div className={`vx-admin__status-pill vx-admin__status--${c.status}`}>{c.status?.replace('_', ' ')}</div>
                </div>

                <div className="vx-admin__card-body">
                  <div>
                    <div className="vx-admin__card-detail-label">Business</div>
                    <div className="vx-admin__card-detail-value">{c.businessName}</div>
                  </div>
                  <div>
                    <div className="vx-admin__card-detail-label">Budget</div>
                    <div className="vx-admin__card-detail-value" style={{ color: '#fff', fontWeight: 700 }}>{c.budget}</div>
                  </div>
                  <div>
                    <div className="vx-admin__card-detail-label">Platforms</div>
                    <div className="vx-admin__card-detail-value">{c.platforms?.join(', ') || '—'}</div>
                  </div>
                  <div>
                    <div className="vx-admin__card-detail-label">Submitted</div>
                    <div className="vx-admin__card-detail-value">{c.dateSubmitted ? new Date(c.dateSubmitted).toLocaleDateString() : 'Recent'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, marginTop: 'auto', paddingTop: 12 }}>
                  <button 
                    className="vx-admin__logout-btn" 
                    style={{ flex: 1, background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', fontSize: 12, padding: '8px 12px' }}
                    onClick={() => updateStatus(c.id, 'approved')}
                    disabled={c.status === 'approved'}
                  >
                    <CheckCircle2 size={14} /> Approve
                  </button>
                  <button 
                    className="vx-admin__logout-btn" 
                    style={{ background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px' }}
                    onClick={() => setSelectedCampaign(c)}
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="vx-admin__empty-state" style={{ gridColumn: '1 / -1' }}>
                <Search size={40} style={{ marginBottom: 16, opacity: 0.1 }} />
                <p>No campaigns found matching your search</p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ animation: 'adFadeIn 0.5s ease both' }}>
            {filteredUsers.length > 0 ? filteredUsers.map((u, i) => (
              <motion.div key={u._id || i} className="vx-admin__user-row" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                <div className="vx-admin__card-avatar" style={{ width: 44, height: 44, fontSize: 16, borderRadius: 12, background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
                  {u.name?.[0] || 'U'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{u.name}</div>
                  <div style={{ color: '#64748b', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={12} /> {u.email}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                     <div style={{ fontSize: 10, color: '#475569', fontWeight: 800, textTransform: 'uppercase' }}>Joined</div>
                     <div style={{ fontSize: 13, color: '#94a3b8' }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</div>
                   </div>
                   <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.05)' }} />
                   <ChevronRight size={18} style={{ color: '#334155' }} />
                </div>
              </motion.div>
            )) : (
              <div className="vx-admin__empty-state">
                <Users size={40} style={{ marginBottom: 16, opacity: 0.1 }} />
                <p>No users found in the database</p>
              </div>
            )}
          </div>
        )}

        {/* Modal Portal */}
        <AnimatePresence>
          {selectedCampaign && (
            <DetailModal 
              campaign={selectedCampaign} 
              onClose={() => setSelectedCampaign(null)} 
              onApprove={id => updateStatus(id, 'approved')}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
