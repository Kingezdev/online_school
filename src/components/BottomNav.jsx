import { C } from '../data/constants.js';

export function BottomNav({ page, setPage, role }) {
  const aItems = [
    {label:"Dashboard",icon:"🏠"},{label:"Users",icon:"👥"},{label:"System",icon:"⚙️"},{label:"Reports",icon:"📊"},
  ];
  const sItems = [
    {label:"Dashboard",icon:""},{label:"Course",icon:""},
    {label:"Forum",icon:""},{label:"Assignment",icon:""},
  ];
  const lItems = [
    {label:"Dashboard",icon:"🏠"},{label:"My Courses",icon:"📚"},
    {label:"Attendance",icon:"✅"},{label:"Reports",icon:"📈"},
  ];
  const items = role==="admin"?aItems:role==="lecturer"?lItems:sItems;
  return (
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:"white",borderTop:"1px solid #e0e0e0",display:"flex",zIndex:100,boxShadow:"0 -2px 10px rgba(0,0,0,0.08)"}}>
      {items.map(item=>{
        const key=item.label.toLowerCase();
        const active=page===key;
        return (
          <button key={key} onClick={()=>setPage(key)} style={{
            flex:1,background:"none",border:"none",padding:"8px 0 6px",
            display:"flex",flexDirection:"column",alignItems:"center",gap:2,
            color:active?C.blue:"#999",cursor:"pointer"
          }}>
            <span style={{fontSize:18}}>{item.icon}</span>
            <span style={{fontSize:9,fontWeight:active?700:400}}>{item.label}</span>
            {active&&<div style={{width:4,height:4,borderRadius:"50%",background:C.blue}}/>}
          </button>
        );
      })}
    </div>
  );
}
