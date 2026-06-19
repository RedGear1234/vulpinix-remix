import { API_BASE } from "../config/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox, MessageCircle, Heart, ExternalLink, RefreshCw,
  AlertCircle, Send, Facebook, Instagram, Users,
  ChevronDown, ChevronUp, ArrowLeft, Filter
} from "lucide-react";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { DashboardTopBar } from "../components/DashboardTopBar";

const S = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  .cm-shell{display:flex;height:100vh;background:#070b12;overflow:hidden;font-family:'Inter',sans-serif;}
  .cm-main{flex:1;display:flex;flex-direction:column;overflow:hidden;}
  .cm-scroll{flex:1;overflow-y:auto;overflow-x:hidden;padding:32px 36px 100px;}
  .cm-scroll::-webkit-scrollbar{width:6px;}
  .cm-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.08);border-radius:3px;}
  .cm-inner{max-width:1100px;margin:0 auto;position:relative;z-index:1;}
  .cm-orb{position:fixed;pointer-events:none;border-radius:50%;z-index:0;}
  .cm-orb1{width:600px;height:600px;top:-150px;right:-120px;background:radial-gradient(circle,rgba(56,189,248,0.07) 0%,transparent 70%);}
  .cm-orb2{width:500px;height:500px;bottom:-150px;left:-60px;background:radial-gradient(circle,rgba(167,139,250,0.06) 0%,transparent 70%);}

  /* Hero */
  .cm-hero{border-radius:24px;padding:28px 36px;margin-bottom:24px;background:linear-gradient(135deg,#0a0f1e,#0f1828);border:1px solid rgba(56,189,248,0.14);display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;position:relative;overflow:hidden;}
  .cm-hero-line{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#1877F2,#38bdf8,#E1306C,#1877F2);background-size:300%;animation:cm-shimmer 4s linear infinite;}
  @keyframes cm-shimmer{0%{background-position:0%}100%{background-position:300%}}

  /* Stats row */
  .cm-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px;}
  .cm-stat{border-radius:18px;padding:18px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);}
  .cm-stat-ic{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;margin-bottom:10px;}
  .cm-stat-val{font-size:22px;font-weight:900;line-height:1;margin-bottom:3px;}
  .cm-stat-lbl{font-size:10px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:0.07em;}

  /* Filter bar */
  .cm-filters{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap;}
  .cm-filter{display:flex;align-items:center;gap:6px;padding:7px 16px;border-radius:20px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);color:#64748b;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.18s;}
  .cm-filter:hover{background:rgba(255,255,255,0.06);color:#94a3b8;}
  .cm-filter.active{background:rgba(56,189,248,0.12);border-color:rgba(56,189,248,0.3);color:#38bdf8;}
  .cm-filter.fb.active{background:rgba(24,119,242,0.12);border-color:rgba(24,119,242,0.3);color:#60a5fa;}
  .cm-filter.ig.active{background:rgba(225,48,108,0.12);border-color:rgba(225,48,108,0.3);color:#f472b6;}

  /* Interaction card */
  .cm-card{border-radius:18px;padding:20px;margin-bottom:14px;background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);transition:all 0.2s;}
  .cm-card:hover{border-color:rgba(255,255,255,0.12);}
  .cm-card.fb{border-left:3px solid rgba(24,119,242,0.5);}
  .cm-card.ig{border-left:3px solid rgba(225,48,108,0.5);}

  /* User row */
  .cm-user-row{display:flex;align-items:flex-start;gap:14px;margin-bottom:14px;}
  .cm-avatar{width:44px;height:44px;border-radius:14px;object-fit:cover;flex-shrink:0;border:2px solid rgba(255,255,255,0.08);}
  .cm-avatar-fb{border-color:rgba(24,119,242,0.3);}
  .cm-avatar-ig{border-color:rgba(225,48,108,0.3);}
  .cm-user-info{flex:1;min-width:0;}
  .cm-username{font-size:14px;font-weight:800;color:#e2e8f0;margin-bottom:2px;}
  .cm-meta{font-size:11px;color:#475569;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
  .cm-plat-badge{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:6px;font-size:10px;font-weight:800;}
  .cm-plat-badge.fb{background:rgba(24,119,242,0.12);color:#60a5fa;border:1px solid rgba(24,119,242,0.2);}
  .cm-plat-badge.ig{background:rgba(225,48,108,0.12);color:#f472b6;border:1px solid rgba(225,48,108,0.2);}
  .cm-comment-text{font-size:14px;color:#cbd5e1;line-height:1.6;margin-bottom:12px;padding:12px 14px;background:rgba(255,255,255,0.03);border-radius:10px;}

  /* Post context */
  .cm-post-ref{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:10px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);margin-bottom:12px;}
  .cm-post-thumb{width:36px;height:36px;border-radius:8px;object-fit:cover;background:#0f1628;flex-shrink:0;display:flex;align-items:center;justify-content:center;}
  .cm-post-preview{font-size:11px;color:#64748b;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

  /* Actions row */
  .cm-actions{display:flex;align-items:center;gap:10px;}
  .cm-likes{font-size:11px;color:#64748b;display:flex;align-items:center;gap:4px;}
  .cm-reply-toggle{display:flex;align-items:center;gap:5px;padding:5px 12px;border-radius:8px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);color:#64748b;font-size:12px;font-weight:700;cursor:pointer;transition:all 0.18s;}
  .cm-reply-toggle:hover{color:#94a3b8;background:rgba(255,255,255,0.07);}
  .cm-ext-link{display:flex;align-items:center;gap:4px;padding:5px 10px;border-radius:8px;background:none;border:none;color:#475569;cursor:pointer;transition:all 0.18s;}
  .cm-ext-link:hover{color:#94a3b8;}

  /* Replies */
  .cm-replies{margin-top:12px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.05);}
  .cm-reply-item{display:flex;gap:10px;margin-bottom:10px;}
  .cm-reply-avatar{width:30px;height:30px;border-radius:8px;object-fit:cover;flex-shrink:0;}
  .cm-reply-body{flex:1;background:rgba(255,255,255,0.02);border-radius:8px;padding:8px 12px;}
  .cm-reply-user{font-size:11px;font-weight:800;color:#a78bfa;margin-bottom:3px;}
  .cm-reply-text{font-size:12px;color:#94a3b8;line-height:1.4;}

  /* Reply compose */
  .cm-compose{display:flex;gap:8px;margin-top:12px;}
  .cm-compose-input{flex:1;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:8px 12px;color:#f1f5f9;font-size:13px;font-family:'Inter',sans-serif;}
  .cm-compose-input:focus{outline:none;border-color:rgba(56,189,248,0.4);}
  .cm-compose-send{display:flex;align-items:center;gap:6px;padding:8px 16px;border-radius:10px;background:#1877F2;border:none;color:#fff;font-weight:700;font-size:13px;cursor:pointer;transition:all 0.2s;}
  .cm-compose-send.ig{background:#E1306C;}
  .cm-compose-send:disabled{opacity:0.4;cursor:not-allowed;}

  /* States */
  .cm-notice{border-radius:20px;padding:52px 32px;background:rgba(255,255,255,0.02);border:1px dashed rgba(255,255,255,0.08);text-align:center;}
  .cm-btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:12px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);color:#94a3b8;font-weight:700;font-size:13px;cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;}
  .cm-btn:hover{background:rgba(255,255,255,0.08);}
  @media(max-width:900px){.cm-stats{grid-template-columns:repeat(2,1fr);}}
`;

interface Reply { id:string; username:string; profilePictureUrl:string; text:string; likeCount:number; timestamp:string; }
interface Interaction {
  id:string; platform:"instagram"|"facebook"; type:string;
  postId:string; postPreview:string; postThumbnail:string|null; postPermalink:string|null;
  username:string; profilePictureUrl:string; text:string; likeCount:number; timestamp:string; replies:Reply[];
}

function timeAgo(ts:string){
  const diff=Date.now()-new Date(ts).getTime();
  const m=Math.floor(diff/60000);
  if(m<1)return"just now";if(m<60)return`${m}m ago`;
  const h=Math.floor(m/60);if(h<24)return`${h}h ago`;
  return new Date(ts).toLocaleDateString("en-US",{month:"short",day:"numeric"});
}

export default function CommunityManagementPage(){
  const navigate=useNavigate();
  const [data,setData]=useState<{totalInteractions:number;igConnected:boolean;fbConnected:boolean;interactions:Interaction[]}|null>(null);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [error,setError]=useState("");
  const [filter,setFilter]=useState<"all"|"instagram"|"facebook">("all");
  const [expanded,setExpanded]=useState<Record<string,boolean>>({});
  const [replyText,setReplyText]=useState<Record<string,string>>({});
  const [posting,setPosting]=useState<Record<string,boolean>>({});

  const userInfo=JSON.parse(localStorage.getItem("userInfo")||"{}");
  const userName=userInfo.name?.split(" ")[0]||"User";
  const userInitial=userName[0]?.toUpperCase()||"U";

  const load=async(isRefresh=false)=>{
    const token=localStorage.getItem("authToken");
    if(!token){setError("Not authenticated");setLoading(false);return;}
    if(isRefresh)setRefreshing(true);else setLoading(true);
    setError("");
    try{
      const r=await fetch(`${API_BASE}/api/social/community/inbox`,{headers:{Authorization:`Bearer ${token}`}});
      const d=await r.json();
      if(d.success)setData(d);
      else setError(d.details||d.error||"Failed to load inbox");
    }catch{setError("Network error. Please check your connection.");}
    finally{setLoading(false);setRefreshing(false);}
  };

  const postReply=async(interaction:Interaction)=>{
    const text=replyText[interaction.id]?.trim();
    if(!text)return;
    const token=localStorage.getItem("authToken");
    if(!token)return;
    setPosting(p=>({...p,[interaction.id]:true}));
    try{
      const endpoint=interaction.platform==="instagram"
        ?`${API_BASE}/api/social/instagram/comments/${interaction.id}`
        :`${API_BASE}/api/social/facebook/comments/${interaction.id}`;
      const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({message:text,isReply:true})});
      const d=await r.json();
      if(d.success){setReplyText(t=>({...t,[interaction.id]:""}));load(true);}
    }catch{console.error("Reply failed");}
    finally{setPosting(p=>({...p,[interaction.id]:false}));}
  };

  useEffect(()=>{load();},[]);

  const FV={initial:{opacity:0,y:20},animate:{opacity:1,y:0}};
  const filtered=data?.interactions.filter(i=>filter==="all"||i.platform===filter)??[];
  const igCount=data?.interactions.filter(i=>i.platform==="instagram").length??0;
  const fbCount=data?.interactions.filter(i=>i.platform==="facebook").length??0;

  return(
    <div className="cm-shell">
      <style dangerouslySetInnerHTML={{__html:S}}/>
      <DashboardSidebar userName={userName} userInitial={userInitial}/>
      <div className="cm-main">
        <DashboardTopBar userName={userName} userInitial={userInitial}/>
        <div className="cm-scroll">
          <div className="cm-orb cm-orb1"/><div className="cm-orb cm-orb2"/>
          <div className="cm-inner">

            {/* Hero */}
            <motion.div {...FV} transition={{duration:0.4}} className="cm-hero">
              <div className="cm-hero-line"/>
              <div style={{display:"flex",alignItems:"center",gap:16}}>
                <div style={{width:52,height:52,borderRadius:16,background:"linear-gradient(135deg,#1877F2,#38bdf8)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Inbox size={26} color="#fff"/>
                </div>
                <div>
                  <div style={{fontSize:24,fontWeight:900,color:"#f1f5f9"}}>Community <span style={{background:"linear-gradient(135deg,#38bdf8,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Management</span></div>
                  <div style={{color:"#64748b",fontSize:13}}>Unified inbox — Facebook & Instagram comments with user profiles</div>
                </div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button className="cm-btn" onClick={()=>load(true)} disabled={refreshing}>
                  <motion.span animate={refreshing?{rotate:360}:{}} transition={{duration:1,repeat:Infinity,ease:"linear"}} style={{display:"flex"}}><RefreshCw size={13}/></motion.span>
                  {refreshing?"Refreshing…":"Refresh"}
                </button>
                <button className="cm-btn" onClick={()=>navigate("/dashboard")}><ArrowLeft size={13}/>Dashboard</button>
              </div>
            </motion.div>

            {/* Stats */}
            {data&&(
              <motion.div {...FV} transition={{delay:0.1}} className="cm-stats">
                {[
                  {icon:<Inbox size={16}/>,bg:"rgba(56,189,248,.12)",col:"#38bdf8",val:data.totalInteractions,lbl:"Total Interactions"},
                  {icon:<Facebook size={16}/>,bg:"rgba(24,119,242,.12)",col:"#1877F2",val:fbCount,lbl:"Facebook Comments"},
                  {icon:<Instagram size={16}/>,bg:"rgba(225,48,108,.12)",col:"#E1306C",val:igCount,lbl:"Instagram Comments"},
                  {icon:<Users size={16}/>,bg:"rgba(167,139,250,.12)",col:"#a78bfa",val:new Set(data.interactions.map(i=>i.username)).size,lbl:"Unique Commenters"},
                ].map((s,i)=>(
                  <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.1+i*0.06}} className="cm-stat">
                    <div className="cm-stat-ic" style={{background:s.bg,color:s.col}}>{s.icon}</div>
                    <div className="cm-stat-val" style={{color:s.col}}>{s.val}</div>
                    <div className="cm-stat-lbl">{s.lbl}</div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Filters */}
            {data&&(
              <div className="cm-filters">
                <Filter size={13} color="#334155" style={{alignSelf:"center"}}/>
                {([["all","All",""],["facebook","Facebook","fb"],["instagram","Instagram","ig"]] as const).map(([id,label,cls])=>(
                  <button key={id} className={`cm-filter ${cls} ${filter===id?"active":""}`} onClick={()=>setFilter(id)}>
                    {id==="facebook"&&<Facebook size={11}/>}{id==="instagram"&&<Instagram size={11}/>}
                    {label} {id!=="all"&&<span style={{opacity:0.6}}>({id==="facebook"?fbCount:igCount})</span>}
                  </button>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading&&(
              <div style={{display:"flex",justifyContent:"center",padding:"80px 0"}}>
                <div style={{width:44,height:44,border:"4px solid rgba(56,189,248,0.15)",borderTopColor:"#38bdf8",borderRadius:"50%",animation:"cm-spin 0.8s linear infinite"}}/>
                <style>{`@keyframes cm-spin{to{transform:rotate(360deg)}}`}</style>
              </div>
            )}

            {/* Error */}
            {!loading&&error&&(
              <motion.div {...FV} className="cm-notice">
                <AlertCircle size={40} style={{margin:"0 auto 16px",color:"#38bdf8",opacity:0.6}}/>
                <div style={{fontSize:18,fontWeight:800,color:"#f1f5f9",marginBottom:8}}>
                  {error.includes("NOT_CONNECTED")?"No Social Account Connected":"Could Not Load Inbox"}
                </div>
                <div style={{color:"#64748b",fontSize:13,maxWidth:480,margin:"0 auto 20px"}}>{error}</div>
                {error.includes("NOT_CONNECTED")&&(
                  <button className="cm-btn" style={{margin:"0 auto"}} onClick={()=>navigate("/social")}>Connect Account →</button>
                )}
              </motion.div>
            )}

            {/* Empty */}
            {!loading&&data&&filtered.length===0&&(
              <motion.div {...FV} className="cm-notice">
                <MessageCircle size={44} style={{margin:"0 auto 16px",opacity:0.15}}/>
                <div style={{fontSize:17,fontWeight:700,color:"#e2e8f0",marginBottom:8}}>No interactions yet</div>
                <div style={{color:"#475569",fontSize:13}}>When your audience comments on your posts, they'll appear here with their profile pictures.</div>
              </motion.div>
            )}

            {/* Interaction cards */}
            <AnimatePresence>
              {!loading&&filtered.map((item,i)=>{
                const isFB=item.platform==="facebook";
                const isExpanded=expanded[item.id];
                const replyVal=replyText[item.id]||"";
                return(
                  <motion.div
                    key={item.id}
                    initial={{opacity:0,y:16}}
                    animate={{opacity:1,y:0}}
                    exit={{opacity:0,y:-8}}
                    transition={{delay:i*0.04}}
                    className={`cm-card ${isFB?"fb":"ig"}`}
                  >
                    {/* Post reference */}
                    <div className="cm-post-ref">
                      {item.postThumbnail
                        ?<img src={item.postThumbnail} alt="" className="cm-post-thumb" onError={e=>{(e.target as HTMLImageElement).style.display="none";}}/>
                        :<div className="cm-post-thumb">{isFB?<Facebook size={14} color="#1877F2"/>:<Instagram size={14} color="#E1306C"/>}</div>
                      }
                      <span className="cm-post-preview">{item.postPreview}</span>
                      {item.postPermalink&&(
                        <button className="cm-ext-link" onClick={()=>window.open(item.postPermalink!,"_blank")}><ExternalLink size={11}/></button>
                      )}
                    </div>

                    {/* User + comment */}
                    <div className="cm-user-row">
                      <img
                        src={item.profilePictureUrl}
                        alt={item.username}
                        className={`cm-avatar ${isFB?"cm-avatar-fb":"cm-avatar-ig"}`}
                        onError={e=>{(e.target as HTMLImageElement).src=`https://ui-avatars.com/api/?name=${encodeURIComponent(item.username[0]||"U")}&background=334155&color=fff&size=64`;}}
                      />
                      <div className="cm-user-info">
                        <div className="cm-username">{item.username}</div>
                        <div className="cm-meta">
                          <span className={`cm-plat-badge ${isFB?"fb":"ig"}`}>
                            {isFB?<Facebook size={9}/>:<Instagram size={9}/>}
                            {isFB?"Facebook":"Instagram"}
                          </span>
                          <span>{timeAgo(item.timestamp)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="cm-comment-text">{item.text}</div>

                    {/* Actions */}
                    <div className="cm-actions">
                      <span className="cm-likes"><Heart size={11} color="#ef4444"/>{item.likeCount} likes</span>
                      <button className="cm-reply-toggle" onClick={()=>setExpanded(e=>({...e,[item.id]:!e[item.id]}))}>
                        <MessageCircle size={11}/>
                        {item.replies.length>0?`${item.replies.length} Repl${item.replies.length===1?"y":"ies"}`:"Reply"}
                        {isExpanded?<ChevronUp size={11}/>:<ChevronDown size={11}/>}
                      </button>
                    </div>

                    {/* Expanded: replies + compose */}
                    {isExpanded&&(
                      <div className="cm-replies">
                        {item.replies.map(r=>(
                          <div key={r.id} className="cm-reply-item">
                            <img src={r.profilePictureUrl} alt={r.username} className="cm-reply-avatar" onError={e=>{(e.target as HTMLImageElement).src=`https://ui-avatars.com/api/?name=${r.username[0]||"U"}&background=334155&color=fff&size=64`;}}/>
                            <div className="cm-reply-body">
                              <div className="cm-reply-user">@{r.username}</div>
                              <div className="cm-reply-text">{r.text}</div>
                            </div>
                          </div>
                        ))}
                        <div className="cm-compose">
                          <input
                            className="cm-compose-input"
                            placeholder="Write a reply…"
                            value={replyVal}
                            onChange={e=>setReplyText(t=>({...t,[item.id]:e.target.value}))}
                            onKeyDown={e=>e.key==="Enter"&&postReply(item)}
                          />
                          <button className={`cm-compose-send ${isFB?"":"ig"}`} disabled={!replyVal.trim()||posting[item.id]} onClick={()=>postReply(item)}>
                            <Send size={13}/>{posting[item.id]?"…":"Send"}
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}
