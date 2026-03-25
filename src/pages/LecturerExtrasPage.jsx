import { useW } from '../hooks/useW.js';
import { C, LECTURER_COURSES } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';

export function LecturerExtrasPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const resources = [
    {
      id: 1,
      title: "Teaching Resources",
      description: "Access teaching materials, templates, and guides",
      icon: "📚",
      category: "Teaching",
      items: 45
    },
    {
      id: 2,
      title: "Professional Development",
      description: "Training programs and certification opportunities",
      icon: "🎓",
      category: "Development",
      items: 12
    },
    {
      id: 3,
      title: "Research Tools",
      description: "Access to research databases and tools",
      icon: "🔬",
      category: "Research",
      items: 28
    },
    {
      id: 4,
      title: "Administrative Forms",
      description: "Download and submit administrative forms",
      icon: "📋",
      category: "Admin",
      items: 15
    }
  ];

  const announcements = [
    {
      id: 1,
      title: "Faculty Meeting - March 30",
      date: "2026-03-25",
      priority: "high",
      description: "Monthly faculty meeting to discuss curriculum updates"
    },
    {
      id: 2,
      title: "Professional Development Workshop",
      date: "2026-03-24",
      priority: "medium",
      description: "Workshop on innovative teaching methods"
    },
    {
      id: 3,
      title: "Research Grant Applications Open",
      date: "2026-03-23",
      priority: "medium",
      description: "Apply for research funding for next semester"
    }
  ];

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "high": return C.red;
      case "medium": return C.orange;
      case "low": return C.blue;
      default: return C.gray;
    }
  };

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Faculty Resources</h2>
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(3,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"Resources",value:"4",icon:"📚",color:C.blue},
          {label:"Announcements",value:"3",icon:"📢",color:C.orange},
          {label:"Tools",value:"8",icon:"🛠️",color:C.green},
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

      <div style={{display:"grid",gridTemplateColumns:isLg?"2fr 1fr":w>=640?"1fr 1fr":"1fr",gap:16}}>
        <SectionCard title="Available Resources" icon="📚" color={C.blue}>
          <div style={{padding:12}}>
            {resources.map((resource, index) => (
              <div key={index} style={{
                background:"#f9f9f9",borderRadius:8,padding:12,marginBottom:8,
                cursor:"pointer",transition:"all 0.2s"
              }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
                  <div style={{fontSize:24}}>{resource.icon}</div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:14,fontWeight:600,color:"#333",marginBottom:2}}>{resource.title}</div>
                    <div style={{fontSize:11,color:"#666",marginBottom:2}}>{resource.description}</div>
                    <div style={{display:"flex",gap:8}}>
                      <Badge color={C.blue} style={{fontSize:9}}>{resource.category}</Badge>
                      <Badge color={C.green} style={{fontSize:9}}>{resource.items} items</Badge>
                    </div>
                  </div>
                </div>
                <button style={{
                  background:C.blue,color:"white",border:"none",borderRadius:4,
                  padding:"4px 8px",fontSize:9,cursor:"pointer"
                }}>
                  Access Resource
                </button>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Announcements" icon="📢" color={C.orange}>
          <div style={{padding:12}}>
            {announcements.map((announcement, index) => (
              <div key={index} style={{
                background:"#f9f9f9",borderRadius:8,padding:12,marginBottom:8,
                borderLeft:`3px solid ${getPriorityColor(announcement.priority)}`
              }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#333"}}>{announcement.title}</div>
                  <Badge color={getPriorityColor(announcement.priority)} style={{fontSize:9}}>
                    {announcement.priority}
                  </Badge>
                </div>
                <div style={{fontSize:10,color:"#666",marginBottom:4}}>
                  {announcement.description}
                </div>
                <div style={{fontSize:9,color:"#888"}}>
                  📅 {announcement.date}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Quick Links" icon="🔗" color={C.green}>
        <div style={{padding:12}}>
          <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:12}}>
            {[
              {title:"Faculty Handbook",description:"Policies and procedures",icon:"📖"},
              {title:"IT Support",description:"Technical assistance",icon:"💻"},
              {title:"Library Access",description:"Research databases",icon:"🔍"},
              {title:"HR Portal",description:"Employee services",icon:"👥"},
            ].map((link, index) => (
              <div key={index} style={{
                background:"white",border:"1px solid #e0e0e0",borderRadius:8,
                padding:12,cursor:"pointer",transition:"all 0.2s",textAlign:"center"
              }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{fontSize:20,marginBottom:8}}>{link.icon}</div>
                <div style={{fontSize:11,fontWeight:600,color:"#333",marginBottom:2}}>{link.title}</div>
                <div style={{fontSize:9,color:"#666"}}>{link.description}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
