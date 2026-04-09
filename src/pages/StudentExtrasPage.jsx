import { useState, useEffect } from 'react';
import { useW } from '../hooks/useW.js';
import { C, COURSES } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';
import { studentExtrasAPI } from '../utils/api.js';

export function StudentExtrasPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;
  const [extraResources, setExtraResources] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState({
    resources: 0,
    announcements: 0,
    services: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentExtras();
  }, []);

  const fetchStudentExtras = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await studentExtrasAPI.getStudentExtras();
      
      console.log('Student Extras API Response:', response);
      
      if (response.success) {
        setExtraResources(response.resources || []);
        setAnnouncements(response.announcements || []);
        setStats(response.stats || {
          resources: 0,
          announcements: 0,
          services: 0
        });
      } else {
        console.log('API returned success=false');
        setError('Failed to fetch student resources');
      }
    } catch (error) {
      console.log('API Error:', error);
      setError(error.message || 'Failed to fetch student resources');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "high": return C.red;
      case "medium": return C.orange;
      case "low": return C.blue;
      default: return C.gray;
    }
  };

  const handleAccessResource = (resource) => {
    if (resource.url) {
      window.open(resource.url, '_blank');
    }
  };

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Student Resources</h2>
      
      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: "#fee",
          color: "#c53030",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "16px",
          fontSize: "14px",
          border: "1px solid #fed7d7"
        }}>
          {error}
        </div>
      )}

      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(3,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"Resources",value:stats.resources.toString(),icon:"📚",color:C.blue},
          {label:"Announcements",value:stats.announcements.toString(),icon:"📢",color:C.orange},
          {label:"Services",value:stats.services.toString(),icon:"🛠️",color:C.green},
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
            {loading ? (
              <div style={{textAlign: "center", padding: "40px"}}>
                <div style={{fontSize: "16px", color: "#6b7280"}}>Loading student resources...</div>
              </div>
            ) : extraResources.length === 0 ? (
              <div style={{textAlign: "center", padding: "40px"}}>
                <div style={{fontSize: "16px", color: "#6b7280"}}>No student resources found</div>
                <div style={{fontSize: "14px", color: "#9ca3af", marginTop: "8px"}}>
                  Check back later for new resources
                </div>
              </div>
            ) : (
              extraResources.map((resource, index) => (
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
                        <Badge color={C.green} style={{fontSize:9}}>{resource.access}</Badge>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAccessResource(resource)}
                    style={{
                      background:C.blue,color:"white",border:"none",borderRadius:4,
                      padding:"4px 8px",fontSize:9,cursor:"pointer"
                    }}
                  >
                    Access Resource
                  </button>
                </div>
              ))
            )}
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
              {title:"Student Handbook",description:"Rules and regulations",icon:"📖"},
              {title:"IT Support",description:"Technical assistance",icon:"💻"},
              {title:"Health Services",description:"Medical support",icon:"🏥"},
              {title:"Sports Facilities",description:"Recreation and fitness",icon:"⚽"},
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
