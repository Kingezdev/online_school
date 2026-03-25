export function StatPill({icon,value,label,color}) {
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
      <div style={{width:44,height:44,borderRadius:"50%",background:color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{icon}</div>
      <div style={{fontSize:22,fontWeight:800,color:"#333"}}>{value}</div>
      <div style={{fontSize:10,color:"#888",textAlign:"center",letterSpacing:0.5}}>{label}</div>
    </div>
  );
}
