import { useState } from "react";
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';

export function LoginPage({ onLogin }) {
  const [u,setU]=useState(""); const [p,setP]=useState("");
  const [role,setRole]=useState("student"); const [loading,setLoading]=useState(false);
  const w = useW(); const isLg = w>=1024;
  return (
    <div style={{minHeight:"100vh",position:"relative",overflow:"hidden",fontFamily:"Arial,sans-serif",display:"flex"}}>
      {isLg&&(
        <div style={{flex:1,background:"linear-gradient(135deg, rgba(26, 26, 46, 0.8) 0%, rgba(45, 54, 97, 0.8) 50%, rgba(74, 86, 104, 0.8) 100%), url('/ABU.jpeg')",backgroundSize:"contain",backgroundPosition:"center",backgroundRepeat:"no-repeat",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:48,position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-80,right:-80,width:400,height:400,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>
          <div style={{position:"absolute",bottom:-60,left:-60,width:300,height:300,borderRadius:"50%",background:"rgba(255,255,255,0.03)"}}/>
          <div style={{textAlign:"center",color:"white",zIndex:1}}>
            <div style={{fontSize:64,marginBottom:20}}>🎓</div>
            <div style={{fontSize:28,fontWeight:800,marginBottom:8}}>VigilearnLMS</div>
            <div style={{fontSize:15,color:"rgba(255,255,255,0.7)",maxWidth:360,lineHeight:1.6}}>
              Ahmadu Bello University Distance Learning Centre — empowering education across Nigeria and beyond.
            </div>
            <div style={{marginTop:40,display:"flex",gap:24,justifyContent:"center"}}>
              {[{v:"5,000+",l:"Students"},{v:"200+",l:"Courses"},{v:"50+",l:"Lecturers"}].map(s=>(
                <div key={s.l} style={{textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:800,color:"white"}}>{s.v}</div>
                  <div style={{fontSize:12,color:"rgba(255,255,255,0.6)"}}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div style={{width:isLg?440:"100%",background:isLg?"white":"linear-gradient(135deg,#1a1a2e 0%,#2d3561 50%,#4a5568 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:isLg?48:24}}>
        {!isLg&&<div style={{position:"absolute",top:-60,right:-60,width:250,height:250,borderRadius:"50%",background:"rgba(255,255,255,0.04)"}}/>}
        <div style={{background:isLg?"#f8f9fa":"white",borderRadius:12,padding:isLg?0:"28px 28px",width:"100%",maxWidth:380,boxShadow:isLg?"none":"0 20px 60px rgba(0,0,0,0.4)"}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:10,background:isLg?"white":"transparent",borderRadius:8,padding:"8px 16px",boxShadow:isLg?"0 2px 8px rgba(0,0,0,0.1)":"none",marginBottom:8}}>
              <img src="/ABU.jpeg" alt="ABU Logo" style={{width:36,height:36,borderRadius:6,objectFit:"contain"}}/>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:10,fontWeight:800,color:"#1a5c2a",letterSpacing:1}}>DISTANCE LEARNING CENTRE</div>
                <div style={{fontSize:8,color:"#888"}}>AHMADU BELLO UNIVERSITY</div>
              </div>
            </div>
            <div style={{fontSize:22,fontWeight:800,color:isLg?"#333":"white",marginTop:8}}>Welcome Back</div>
            <div style={{fontSize:13,color:isLg?"#888":"rgba(255,255,255,0.7)"}}>Sign in to continue</div>
          </div>
          <div style={{background:isLg?"#f0f0f0":"rgba(255,255,255,0.15)",borderRadius:8,padding:3,marginBottom:16,display:"flex",gap:3}}>
            {["student","lecturer"].map(r=>(
              <button key={r} onClick={()=>setRole(r)} style={{
                flex:1,background:role===r?C.blue:"transparent",color:role===r?"white":isLg?"#888":"rgba(255,255,255,0.7)",
                border:"none",borderRadius:6,padding:"8px 0",fontSize:13,cursor:"pointer",fontWeight:700,transition:"all 0.2s"
              }}>{r==="student"?"👨‍🎓 Student":"👨‍🏫 Lecturer"}</button>
            ))}
          </div>
          {[{ph:"Username",v:u,sv:setU,icon:"👤",type:"text"},{ph:"Password",v:p,sv:setP,icon:"🔑",type:"password"}].map(f=>(
            <div key={f.ph} style={{marginBottom:14}}>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#aaa",fontSize:15}}>{f.icon}</span>
                <input type={f.type} value={f.v} onChange={e=>f.sv(e.target.value)} placeholder={f.ph} style={{
                  width:"100%",padding:"11px 12px 11px 36px",border:`1px solid ${isLg?"#ddd":"rgba(255,255,255,0.3)"}`,
                  borderRadius:7,fontSize:13,outline:"none",boxSizing:"border-box",
                  background:isLg?"white":"rgba(255,255,255,0.1)",
                  color:isLg?"#333":"white"
                }}/>
              </div>
            </div>
          ))}
          <button onClick={()=>{setLoading(true);setTimeout(()=>{setLoading(false);onLogin(role);},700);}} style={{
            width:"100%",background:"#1a7a3a",color:"white",border:"none",
            borderRadius:7,padding:13,fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:12
          }}>{loading?"Signing in...":"Login"}</button>
          <div style={{textAlign:"center"}}>
            <span style={{fontSize:12,color:isLg?C.blue:"rgba(255,255,255,0.7)",cursor:"pointer",textDecoration:"underline"}}>Forgot your password?</span>
          </div>
        </div>
        <div style={{color:isLg?"#aaa":"rgba(255,255,255,0.3)",fontSize:10,marginTop:20,textAlign:"center"}}>
          © 2026 – AHMADU BELLO UNIVERSITY DISTANCE LEARNING CENTER
        </div>
      </div>
    </div>
  );
}
