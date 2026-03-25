import { useW } from '../hooks/useW.js';
import { C, COURSES } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';

export function StudentForumPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const forumPosts = [
    {
      id: 1,
      course: "COSC 203",
      title: "Help with Algorithm Complexity Analysis",
      author: "Ahmad Muhammad",
      replies: 5,
      views: 45,
      lastActivity: "2 hours ago",
      pinned: true,
      tags: ["algorithms", "help"]
    },
    {
      id: 2,
      course: "STAT 201",
      title: "Study Group for Probability Quiz",
      author: "Fatima Ali",
      replies: 12,
      views: 89,
      lastActivity: "30 min ago",
      pinned: false,
      tags: ["study-group", "quiz"]
    },
    {
      id: 3,
      course: "MATH 207",
      title: "Linear Algebra Resources",
      author: "Omar Hassan",
      replies: 8,
      views: 67,
      lastActivity: "1 day ago",
      pinned: false,
      tags: ["resources", "linear-algebra"]
    },
    {
      id: 4,
      course: "COSC 205",
      title: "Lab Report Questions",
      author: "Aisha Bello",
      replies: 3,
      views: 34,
      lastActivity: "3 hours ago",
      pinned: false,
      tags: ["lab", "questions"]
    },
    {
      id: 5,
      course: "COSC 211",
      title: "OOP Project Ideas Discussion",
      author: "Musa Ibrahim",
      replies: 15,
      views: 120,
      lastActivity: "5 hours ago",
      pinned: true,
      tags: ["project", "discussion"]
    }
  ];

  return (
    <div style={{padding:isLg?"24px 32px":16}}>
      <h2 style={{margin:"0 0 16px",fontSize:isLg?20:15,color:"#333",fontWeight:700}}>Course Forums</h2>
      
      <div style={{display:"grid",gridTemplateColumns:isLg?"repeat(3,1fr)":w>=640?"repeat(2,1fr)":"1fr",gap:16,marginBottom:16}}>
        {[
          {label:"Total Posts",value:"5",icon:"💬",color:C.blue},
          {label:"My Posts",value:"2",icon:"✍️",color:C.green},
          {label:"Unread",value:"8",icon:"🔔",color:C.orange},
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

      <SectionCard title="Recent Discussions" icon="💬" color={C.blue}>
        <div style={{padding:12}}>
          {forumPosts.map((post, index) => (
            <div key={index} style={{
              background:"#f9f9f9",borderRadius:8,padding:12,marginBottom:8,
              cursor:"pointer",transition:"all 0.2s"
            }}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    {post.pinned && <span style={{fontSize:12}}>📌</span>}
                    <div style={{fontSize:14,fontWeight:600,color:"#333"}}>{post.title}</div>
                  </div>
                  <div style={{fontSize:11,color:"#666",marginBottom:4}}>
                    {post.course} • Posted by {post.author}
                  </div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {post.tags.map((tag, tagIndex) => (
                      <Badge key={tagIndex} color={C.blue} style={{fontSize:9}}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:16,fontSize:10,color:"#888"}}>
                  <span>💬 {post.replies} replies</span>
                  <span>👁 {post.views} views</span>
                  <span>🕐 {post.lastActivity}</span>
                </div>
                <button style={{
                  background:C.blue,color:"white",border:"none",borderRadius:4,
                  padding:"4px 8px",fontSize:9,cursor:"pointer"
                }}>
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
