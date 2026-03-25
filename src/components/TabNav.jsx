import { C } from '../data/constants.js';

export function TabNav({ page, setPage, role }) {
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
    <div style={{background:"white",borderBottom:"1px solid #e0e0e0",display:"flex",overflowX:"auto",padding:"0 12px"}}>
      {items.map(item=>{
        const key=item.label.toLowerCase();
        const active=page===key;
        return (
          <button key={key} onClick={()=>setPage(key)} style={{
            background:"none",border:"none",padding:"10px 12px 8px",fontSize:12,
            color:active?C.blue:"#555",fontWeight:active?700:400,
            borderBottom:active?`2px solid ${C.blue}`:"2px solid transparent",
            cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5
          }}>{item.icon} {item.label}</button>
        );
      })}
    </div>
  );
}
