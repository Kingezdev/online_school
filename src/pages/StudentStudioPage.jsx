import { useState, useEffect } from 'react';
import { useW } from '../hooks/useW.js';
import { C, COURSES } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';
import { studentStudioAPI } from '../utils/api.js';

export function StudentStudioPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;
  const [studioResources, setStudioResources] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    recentlyUsed: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudioResources();
  }, []);

  const fetchStudioResources = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await studentStudioAPI.getStudioResources();
      
      console.log('Studio API Response:', response);
      
      if (response.success) {
        setStudioResources(response.resources || []);
        setStats(response.stats || {
          total: 0,
          available: 0,
          recentlyUsed: 0
        });
      } else {
        console.log('API returned success=false');
        setError('Failed to fetch studio resources');
      }
    } catch (error) {
      console.log('API Error:', error);
      setError(error.message || 'Failed to fetch studio resources');
    } finally {
      setLoading(false);
    }
  };

  const getAccessColor = (access) => {
    return access === "Available" ? C.green : C.red;
  };

  const handleLaunchResource = async (resourceId) => {
    try {
      const response = await studentStudioAPI.getStudioResource(resourceId);
      if (response.success && response.resource.launchUrl) {
        window.open(response.resource.launchUrl, '_blank');
      }
    } catch (error) {
      console.error('Error launching resource:', error);
    }
  };

  const handleOpenGuide = async (resourceId) => {
    try {
      const response = await studentStudioAPI.getStudioResource(resourceId);
      if (response.success && response.resource.guideUrl) {
        window.open(response.resource.guideUrl, '_blank');
      }
    } catch (error) {
      console.error('Error opening guide:', error);
    }
  };

  const handleOpenSupport = async (resourceId) => {
    try {
      const response = await studentStudioAPI.getStudioResource(resourceId);
      if (response.success && response.resource.supportUrl) {
        window.open(response.resource.supportUrl, '_blank');
      }
    } catch (error) {
      console.error('Error opening support:', error);
    }
  };

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Learning Studio</h2>
      
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
          {label:"Total Resources",value:stats.total.toString(),icon:"",color:C.blue},
          {label:"Available",value:stats.available.toString(),icon:"",color:C.green},
          {label:"Recently Used",value:stats.recentlyUsed.toString(),icon:"",color:C.orange},
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
          {loading ? (
            <div style={{textAlign: "center", padding: "40px"}}>
              <div style={{fontSize: "16px", color: "#6b7280"}}>Loading studio resources...</div>
            </div>
          ) : studioResources.length === 0 ? (
            <div style={{textAlign: "center", padding: "40px"}}>
              <div style={{fontSize: "16px", color: "#6b7280"}}>No studio resources found</div>
              <div style={{fontSize: "14px", color: "#9ca3af", marginTop: "8px"}}>
                Enroll in courses to see studio resources here
              </div>
            </div>
          ) : (
            studioResources.map((resource, index) => (
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
                  <button 
                    onClick={() => handleLaunchResource(resource.id)}
                    style={{
                      background:C.blue,color:"white",border:"none",borderRadius:4,
                      padding:"4px 8px",fontSize:9,cursor:"pointer"
                    }}
                  >
                    Launch
                  </button>
                  <button 
                    onClick={() => handleOpenGuide(resource.id)}
                    style={{
                      background:C.gray,color:"white",border:"none",borderRadius:4,
                      padding:"4px 8px",fontSize:9,cursor:"pointer"
                    }}
                  >
                    Guide
                  </button>
                  <button 
                    onClick={() => handleOpenSupport(resource.id)}
                    style={{
                      background:C.green,color:"white",border:"none",borderRadius:4,
                      padding:"4px 8px",fontSize:9,cursor:"pointer"
                    }}
                  >
                    Support
                  </button>
                </div>
              </div>
            ))
          )}
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
