import { useW } from '../hooks/useW.js';
import { C, COURSES } from '../data/constants.js';

export function StudentForumPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const forumPosts = [
    {
      id: 1,
      timeAgo: "8 hours ago",
      author: "SHAFI KASIM",
      module: "MODULE 1: Study Session 4: Triggers and Views in SQL",
      course: "COSC 408",
      description: "Understanding database triggers and views for advanced SQL operations",
      upvotes: 118,
      downvotes: 17,
      comments: 1,
      startDate: "2025-04-02 09:00 AM",
      endDate: "2025-04-09 11:59 PM",
      isNew: true
    },
    {
      id: 2,
      timeAgo: "2 days ago",
      author: "SHAFI KASIM",
      module: "MODULE 2: Study Session 2: Normalization and Database Design",
      course: "COSC 408",
      description: "Database normalization principles and design patterns",
      upvotes: 95,
      downvotes: 8,
      comments: 3,
      startDate: "2025-03-30 10:00 AM",
      endDate: "2025-04-06 11:59 PM",
      isNew: false
    },
    {
      id: 3,
      timeAgo: "1 week ago",
      author: "SHAFI KASIM",
      module: "MODULE 3: Study Session 1: Introduction to NoSQL Databases",
      course: "COSC 408",
      description: "Exploring NoSQL database types and use cases",
      upvotes: 76,
      downvotes: 12,
      comments: 5,
      startDate: "2025-03-25 02:00 PM",
      endDate: "2025-04-01 11:59 PM",
      isNew: false
    },
    {
      id: 4,
      timeAgo: "3 weeks ago",
      author: "SHAFI KASIM",
      module: "MODULE 4: Study Session 3: Database Security and Authentication",
      course: "COSC 408",
      description: "Security best practices for database management",
      upvotes: 62,
      downvotes: 5,
      comments: 2,
      startDate: "2025-03-15 03:00 PM",
      endDate: "2025-03-22 11:59 PM",
      isNew: false
    }
  ];

  return (
    <div style={{padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
      <div style={{marginBottom: "24px"}}>
        <h1 style={{fontSize: "24px", fontWeight: "bold", color: "#111827", margin: "0 0 8px"}}>Course Forum</h1>
        <div style={{fontSize: "14px", color: "#6b7280", marginTop: "8px"}}>Home / Course Forum</div>
      </div>

      <div style={{display: isLg ? "grid" : "block", gridTemplateColumns: isLg ? "3fr 1fr" : "1fr", gap: "24px"}}>
        {/* Main Forum Posts */}
        <div style={isLg ? {} : {marginBottom: "24px"}}>
          {forumPosts.map((post) => (
            <div key={post.id} style={{backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "16px"}}>
              <div style={{display: "flex", alignItems: "flex-start", gap: "16px"}}>
                {/* Profile Icon */}
                <div style={{width: "40px", height: "40px", backgroundColor: "#d1d5db", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0"}}>
                  <svg style={{width: "24px", height: "24px", color: "#6b7280"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>

                {/* Content */}
                <div style={{flex: "1"}}>
                  <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "8px"}}>
                    <div style={{flex: "1"}}>
                      <div style={{display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px"}}>
                        <span style={{fontSize: "14px", color: "#6b7280"}}>{post.timeAgo}</span>
                        {post.isNew && (
                          <span style={{padding: "2px 8px", backgroundColor: "#dc2626", color: "white", fontSize: "12px", borderRadius: "4px", fontWeight: "bold"}}>
                            NEW
                          </span>
                        )}
                      </div>
                      <h3 style={{fontSize: "18px", fontWeight: "bold", color: "#111827", marginBottom: "4px", margin: "0 0 4px"}}>
                        {post.author}
                      </h3>
                      <h4 style={{fontSize: "16px", fontWeight: "medium", color: "#2563eb", marginBottom: "8px", margin: "0 0 8px"}}>
                        {post.module} - {post.course}
                      </h4>
                      <p style={{fontSize: "14px", color: "#6b7280", marginBottom: "16px", margin: "0 0 16px"}}>
                        {post.description}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                    <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
                      {/* Upvote/Downvote */}
                      <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                        <button style={{display: "flex", alignItems: "center", gap: "4px", color: "#6b7280", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer"}} 
                                onMouseEnter={(e) => e.currentTarget.style.color = "#16a34a"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "#6b7280"}>
                          <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          <span style={{fontSize: "14px", fontWeight: "medium"}}>{post.upvotes}</span>
                        </button>
                        <button style={{display: "flex", alignItems: "center", gap: "4px", color: "#6b7280", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer"}} 
                                onMouseEnter={(e) => e.currentTarget.style.color = "#dc2626"}
                                onMouseLeave={(e) => e.currentTarget.style.color = "#6b7280"}>
                          <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          <span style={{fontSize: "14px", fontWeight: "medium"}}>{post.downvotes}</span>
                        </button>
                      </div>

                      {/* Comments */}
                      <button style={{display: "flex", alignItems: "center", gap: "4px", color: "#6b7280", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer"}} 
                              onMouseEnter={(e) => e.currentTarget.style.color = "#2563eb"}
                              onMouseLeave={(e) => e.currentTarget.style.color = "#6b7280"}>
                        <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span style={{fontSize: "14px", fontWeight: "medium"}}>{post.comments}</span>
                      </button>
                    </div>

                    {/* Date/Time */}
                    <div style={{textAlign: "right"}}>
                      <div style={{fontSize: "12px", color: "#6b7280", marginBottom: "4px"}}>START</div>
                      <div style={{fontSize: "14px", fontWeight: "medium", color: "#374151"}}>{post.startDate}</div>
                      <div style={{fontSize: "12px", color: "#6b7280", marginBottom: "4px", marginTop: "8px"}}>END</div>
                      <div style={{fontSize: "14px", fontWeight: "medium", color: "#374151"}}>{post.endDate}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div>
          <div style={{backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", border: "1px solid #e5e7eb", padding: "24px"}}>
            <h3 style={{fontSize: "18px", fontWeight: "bold", color: "#111827", marginBottom: "16px"}}>
              Welcome, MADO ROGERS
            </h3>
            <button style={{width: "100%", backgroundColor: "#2563eb", color: "white", padding: "8px 16px", borderRadius: "8px", transition: "background-color 0.2s", fontWeight: "medium", border: "none", cursor: "pointer"}} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}>
              View General Thread
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
