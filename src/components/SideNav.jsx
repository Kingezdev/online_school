import { C } from '../data/constants.js';

export function SideNav({ page, setPage, role }) {
  const sItems = [
    {label:"Dashboard",icon:"🏠"},{label:"Home",icon:"⊞"},{label:"Course",icon:"📚"},
    {label:"Sub",icon:"📋"},{label:"Grade Book",icon:"📊"},{label:"Forum",icon:"💬"},
    {label:"Assignment",icon:"📝"},{label:"Studio",icon:"🎬"},{label:"Extras",icon:"➕"},
  ];
  const lItems = [
    {label:"Dashboard",icon:"🏠"},{label:"Home",icon:"⊞"},{label:"My Courses",icon:"📚"},
    {label:"Attendance",icon:"✅"},{label:"Grade Book",icon:"📊"},{label:"Assignments",icon:"📝"},
    {label:"Forum",icon:"💬"},{label:"Reports",icon:"📈"},{label:"Extras",icon:"➕"},
  ];
  const items = role==="lecturer"?lItems:sItems;
  return (
    <div style={{width:210,background:"white",borderRight:"1px solid #e8e8e8",minHeight:"100%",flexShrink:0,paddingTop:8}}>
      <div style={{padding:"12px 16px 8px",fontSize:10,color:"#bbb",fontWeight:700,letterSpacing:1}}>NAVIGATION</div>
      {items.map(item=>{
        const key=item.label.toLowerCase();
        const active=page===key;
        return (
          <button key={key} onClick={()=>setPage(key)} style={{
            display:"flex",alignItems:"center",gap:10,width:"100%",textAlign:"left",
            background:active?C.blue+"12":"none",border:"none",
            padding:"10px 16px",fontSize:13,
            color:active?C.blue:"#555",fontWeight:active?700:400,
            borderLeft:active?`3px solid ${C.blue}`:"3px solid transparent",
            cursor:"pointer",transition:"all 0.15s"
          }}>
            <span style={{fontSize:15,width:20,textAlign:"center"}}>{item.icon}</span>
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
