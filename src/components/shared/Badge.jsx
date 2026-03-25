import { C } from '../../data/constants.js';

export const Badge = ({children,color=C.blue})=>(
  <span style={{background:color+"22",color,padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:700}}>{children}</span>
);
