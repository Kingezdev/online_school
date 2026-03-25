import { useW } from '../hooks/useW.js';
import { C, LECTURER_COURSES } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';

export function LecturerForumPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const forumData = [
    {
      id: 1,
      course: "COSC 203",
      title: "Algorithm Discussion Thread",
      posts: 45,
      replies: 128,
      lastActivity: "2 hours ago",
      status: "active",
      pinned: true,
      moderator: "Ahmad Jafar"
    },
    {
      id: 2,
      course: "STAT 201",
      title: "Probability Theory Q&A",
      posts: 32,
      replies: 89,
      lastActivity: "30 min ago",
      status: "active",
      pinned: false,
      moderator: "Khadija Hassan"
    },
    {
      id: 3,
      course: "MATH 207",
      title: "Linear Algebra Study Group",
      posts: 28,
      replies: 67,
      lastActivity: "1 day ago",
      status: "active",
      pinned: false,
      moderator: "Ahmad Jafar"
    },
    {
      id: 4,
      course: "COSC 205",
      title: "Digital Logic Lab Discussion",
      posts: 38,
      replies: 102,
      lastActivity: "3 hours ago",
      status: "moderated",
      pinned: false,
      moderator: "Khadija Hassan"
    },
    {
      id: 5,
      course: "COSC 211",
      title: "OOP Project Collaboration",
      posts: 56,
      replies: 203,
      lastActivity: "5 hours ago",
      status: "active",
      pinned: true,
      moderator: "Ahmad Jafar"
    }
  ];

  const recentPosts = [
    {
      id: 1,
      author: "Ahmad Muhammad",
      course: "COSC 203",
      content: "Having trouble understanding time complexity analysis. Can someone help?",
      timestamp: "2 hours ago",
      replies: 5,
      status: "answered"
    },
    {
      id: 2,
      author: "Fatima Ali",
      course: "STAT 201",
      content: "Looking for study partners for the upcoming quiz",
      timestamp: "30 min ago",
      replies: 8,
      status: "active"
    },
    {
      id: 3,
      author: "Omar Hassan",
      course: "MATH 207",
      content: "Are there any good resources for eigenvalue problems?",
      timestamp: "1 day ago",
      replies: 3,
      status: "answered"
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "active": return C.green;
      case "moderated": return C.orange;
      case "answered": return C.blue;
      default: return C.gray;
    }
  };

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Course Forums</h2>
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"Total Forums",value:"5",icon:"💬",color:C.blue},
          {label:"Total Posts",value:"199",icon:"📝",color:C.green},
          {label:"Pending Moderation",value:"12",icon:"⏳",color:C.orange},
          {label:"Active Discussions",value:"3",icon:"🔥",color:C.red},
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
        <SectionCard title="Forum Management" icon="💬" color={C.blue}>
          <div style={{padding:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{margin:0,fontSize:14,fontWeight:600,color:"#333"}}>Course Forums</h3>
              <button style={{
                background:C.green,color:"white",border:"none",borderRadius:6,
                padding:"6px 12px",fontSize:11,cursor:"pointer",fontWeight:600
              }}>
                + Create Forum
              </button>
            </div>
            
            {forumData.map((forum, index) => (
              <div key={index} style={{
                background:"#f9f9f9",borderRadius:8,padding:12,marginBottom:8,
                cursor:"pointer",transition:"all 0.2s"
              }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      {forum.pinned && <span style={{fontSize:12}}>📌</span>}
                      <div style={{fontSize:14,fontWeight:600,color:"#333"}}>{forum.title}</div>
                    </div>
                    <div style={{fontSize:11,color:"#666",marginBottom:4}}>
                      {forum.course} • Moderated by {forum.moderator}
                    </div>
                    <div style={{display:"flex",gap:12,fontSize:10,color:"#666"}}>
                      <span>📝 {forum.posts} posts</span>
                      <span>💬 {forum.replies} replies</span>
                      <span>🕐 {forum.lastActivity}</span>
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                    <Badge color={getStatusColor(forum.status)}>
                      {forum.status}
                    </Badge>
                  </div>
                </div>
                
                <div style={{display:"flex",gap:4}}>
                  <button style={{
                    background:C.blue,color:"white",border:"none",borderRadius:4,
                    padding:"4px 8px",fontSize:9,cursor:"pointer"
                  }}>
                    Manage
                  </button>
                  <button style={{
                    background:C.gray,color:"white",border:"none",borderRadius:4,
                    padding:"4px 8px",fontSize:9,cursor:"pointer"
                  }}>
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent Activity" icon="🕐" color={C.orange}>
          <div style={{padding:12}}>
            <h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:600,color:"#333"}}>Latest Posts</h3>
            {recentPosts.map((post, index) => (
              <div key={index} style={{
                background:"#f9f9f9",borderRadius:6,padding:10,marginBottom:8,
                borderLeft:`3px solid ${getStatusColor(post.status)}`
              }}>
                <div style={{fontSize:12,fontWeight:600,color:"#333",marginBottom:4}}>
                  {post.content}
                </div>
                <div style={{fontSize:10,color:"#666",marginBottom:4}}>
                  {post.course} • Posted by {post.author} • {post.timestamp}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <Badge color={getStatusColor(post.status)} style={{fontSize:9}}>
                    {post.status}
                  </Badge>
                  <div style={{fontSize:10,color:"#666"}}>
                    💬 {post.replies} replies
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Moderation Tools" icon="🛠️" color={C.green}>
        <div style={{padding:12}}>
          <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(4,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:12}}>
            {[
              {title:"Review Posts",description:"Check pending posts",icon:"👁",color:C.orange},
              {title:"Manage Users",description:"User permissions",icon:"👥",color:C.blue},
              {title:"Content Filter",description:"Set content rules",icon:"🔒",color:C.red},
              {title:"Analytics",description:"Forum statistics",icon:"📊",color:C.green},
            ].map((tool, index) => (
              <div key={index} style={{
                background:"white",border:"1px solid #e0e0e0",borderRadius:8,
                padding:12,cursor:"pointer",transition:"all 0.2s",textAlign:"center"
              }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
                <div style={{fontSize:20,marginBottom:8,color:tool.color}}>{tool.icon}</div>
                <div style={{fontSize:11,fontWeight:600,color:"#333",marginBottom:2}}>{tool.title}</div>
                <div style={{fontSize:9,color:"#666"}}>{tool.description}</div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
