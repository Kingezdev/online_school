import { useW } from '../hooks/useW.js';
import { C, COURSES } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';

export function StudentStudioPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const studioResources = [
    {
      id: 1,
      title: "Programming Lab - Virtual Environment",
      type: "Virtual Lab",
      course: "COSC 203",
      access: "Available",
      description: "Access virtual programming environment with all required tools",
      lastUsed: "2 days ago"
    },
    {
      id: 2,
      title: "Statistics Software - SPSS",
      type: "Software",
      course: "STAT 201",
      access: "Available",
      description: "Statistical analysis software for data processing",
      lastUsed: "1 week ago"
    },
    {
      id: 3,
      title: "Mathematical Computing - MATLAB",
      type: "Software",
      course: "MATH 207",
      access: "Available",
      description: "Mathematical computation and visualization tool",
      lastUsed: "3 days ago"
    },
    {
      id: 4,
      title: "Circuit Simulator - Logisim",
      type: "Simulation",
      course: "COSC 205",
      access: "Available",
      description: "Digital circuit design and simulation tool",
      lastUsed: "5 days ago"
    },
    {
      id: 5,
      title: "Development Environment - VS Code",
      type: "IDE",
      course: "COSC 211",
      access: "Available",
      description: "Integrated development environment for programming",
      lastUsed: "Today"
    }
  ];

  const getAccessColor = (access) => {
    return access === "Available" ? C.green : C.red;
  };

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Learning Studio</h2>
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(3,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"Total Resources",value:"5",icon:"🛠️",color:C.blue},
          {label:"Available",value:"5",icon:"✅",color:C.green},
          {label:"Recently Used",value:"3",icon:"🕐",color:C.orange},
        ].map((stat, index) => (
          <div key={index} style={{
            background:"white",border:"1px solid #e0e0e0",borderRadius:8,
            padding:16,textAlign:"center"
          }}>
            <div style={{fontSize:24,marginBottom:8}}>{stat.icon}</div>
            <div style={{fontSize:20,fontWeight:700,color:"#333",marginBottom:4}}>{stat.value}</div>
            <div style={{fontSize:11,color:"#666"}}>{stat.label}</div>
          </div>
        ))}
      </div>

      <SectionCard title="Available Resources" icon="🛠️" color={C.blue}>
        <div style={{padding:12}}>
          {studioResources.map((resource, index) => (
            <div key={index} style={{
              background:"#f9f9f9",borderRadius:8,padding:12,marginBottom:8,
              cursor:"pointer",transition:"all 0.2s"
            }}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:600,color:"#333",marginBottom:4}}>{resource.title}</div>
                  <div style={{fontSize:11,color:"#666",marginBottom:4}}>
                    {resource.course} • {resource.type}
                  </div>
                  <div style={{fontSize:10,color:"#888",marginBottom:4}}>
                    {resource.description}
                  </div>
                  <div style={{fontSize:10,color:"#666"}}>
                    Last used: {resource.lastUsed}
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                  <Badge color={getAccessColor(resource.access)}>
                    {resource.access}
                  </Badge>
                </div>
              </div>
              
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <button style={{
                  background:C.blue,color:"white",border:"none",borderRadius:4,
                  padding:"4px 8px",fontSize:9,cursor:"pointer"
                }}>
                  Launch
                </button>
                <button style={{
                  background:C.gray,color:"white",border:"none",borderRadius:4,
                  padding:"4px 8px",fontSize:9,cursor:"pointer"
                }}>
                  Guide
                </button>
                <button style={{
                  background:C.green,color:"white",border:"none",borderRadius:4,
                  padding:"4px 8px",fontSize:9,cursor:"pointer"
                }}>
                  Support
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Quick Links" icon="🔗" color={C.orange}>
        <div style={{padding:12}}>
          <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(2,1fr)":"1fr",gap:12}}>
            {[
              {title:"Library Resources",description:"Access digital library and databases",icon:"📚"},
              {title:"Technical Support",description:"Get help with technical issues",icon:"🛠️"},
              {title:"Video Tutorials",description:"Watch instructional videos",icon:"🎥"},
              {title:"Documentation",description:"Access user guides and manuals",icon:"📖"},
            ].map((link, index) => (
              <div key={index} style={{
                background:"white",border:"1px solid #e0e0e0",borderRadius:8,
                padding:12,cursor:"pointer",transition:"all 0.2s"
              }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                  <div style={{fontSize:20}}>{link.icon}</div>
                  <div>
                    <div style={{fontSize:12,fontWeight:600,color:"#333"}}>{link.title}</div>
                    <div style={{fontSize:10,color:"#666"}}>{link.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
