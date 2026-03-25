import { C } from '../../data/constants.js';

export function SectionCard({ title, icon="↗", color=C.blue, children, style={} }) {
  return (
    <div style={{background:"white",border:"1px solid #e0e0e0",borderRadius:8,marginBottom:16,overflow:"hidden",...style}}>
      <div style={{background:color,color:"white",padding:"8px 14px",fontSize:13,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
        <span>{icon}</span>{title}
      </div>
      {children}
    </div>
  );
}

export { Badge } from './Badge.jsx';
export { StatPill } from './StatPill.jsx';
