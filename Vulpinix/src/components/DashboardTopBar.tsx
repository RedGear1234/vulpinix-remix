import { useNavigate } from "react-router";
import { Bell, Settings, Search } from "lucide-react";

interface Props { userName: string; userInitial: string; }

export function DashboardTopBar({ userName, userInitial }: Props) {
  const navigate = useNavigate();
  return (
    <div style={{
      height: 64, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px", borderBottom: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(7,11,18,0.8)", backdropFilter: "blur(12px)", flexShrink: 0, zIndex: 20,
      fontFamily: "'Inter',sans-serif",
    }}>
      <div style={{display:"flex",alignItems:"center",gap:10,background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:12,padding:"8px 16px",width:260}}>
        <Search size={14} color="#334155"/>
        <input placeholder="Search campaigns, analytics…" style={{background:"none",border:"none",outline:"none",color:"#94a3b8",fontSize:13,width:"100%",fontFamily:"'Inter',sans-serif"}}/>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <button onClick={()=>navigate("/settings")} style={{width:36,height:36,borderRadius:11,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#475569"}}>
          <Settings size={15}/>
        </button>
        <button style={{width:36,height:36,borderRadius:11,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",color:"#475569",position:"relative"}}>
          <Bell size={15}/>
          <span style={{position:"absolute",top:7,right:7,width:6,height:6,borderRadius:"50%",background:"#a78bfa"}}/>
        </button>
        <div onClick={()=>navigate("/profile")} style={{width:36,height:36,borderRadius:11,background:"linear-gradient(135deg,#a78bfa,#38bdf8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:"#fff",cursor:"pointer",boxShadow:"0 4px 12px rgba(167,139,250,0.25)"}}>
          {userInitial}
        </div>
      </div>
    </div>
  );
}
