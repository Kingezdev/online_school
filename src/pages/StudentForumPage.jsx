import { useState, useEffect } from 'react';
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { forumsAPI } from '../utils/api.js';

export function StudentForumPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;
  const [forums, setForums] = useState([]);
  const [selectedForum, setSelectedForum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      setLoading(true);
      const response = await forumsAPI.getAll();
      
      if (response.success) {
        setForums(response.forums || []);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch forums');
    } finally {
      setLoading(false);
    }
  };

  const fetchForumDetails = async (forumId) => {
    try {
      const response = await forumsAPI.getById(forumId);
      
      if (response.success) {
        setSelectedForum(response.forum);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch forum details');
    }
  };

  const handleForumClick = (forum) => {
    setSelectedForum(forum);
    fetchForumDetails(forum.id);
  };

  const handleCreatePost = async () => {
    try {
      const response = await forumsAPI.createPost(selectedForum.id, newPostContent);
      
      if (response.success) {
        setShowNewPost(false);
        setNewPostContent('');
        fetchForumDetails(selectedForum.id);
      }
    } catch (error) {
      setError(error.message || 'Failed to create post');
    }
  };

  const handleReply = async (postId) => {
    try {
      const response = await forumsAPI.replyToPost(selectedForum.id, postId, replyContent);
      
      if (response.success) {
        setReplyingTo(null);
        setReplyContent('');
        fetchForumDetails(selectedForum.id);
      }
    } catch (error) {
      setError(error.message || 'Failed to reply to post');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div style={{padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh"}}>
      <div style={{marginBottom: "24px"}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px"}}>
          <h1 style={{margin: 0, fontSize: isLg ? "28px" : "24px", color: "#333", fontWeight: "bold"}}>
            Course Forums
          </h1>
          <button
            onClick={() => setPage("dashboard")}
            style={{
              background: C.blue,
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: "#fee",
          color: "#c53030",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "24px",
          fontSize: "14px",
          border: "1px solid #fed7d7"
        }}>
          {error}
        </div>
      )}

      <div style={{display: "flex", gap: "24px", height: "calc(100vh - 180px)"}}>
        {/* Forums List */}
        <div style={{
          flex: isLg ? "1" : "none",
          maxWidth: isLg ? "400px" : "100%",
          display: isLg ? "block" : (selectedForum ? "none" : "block")
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            maxHeight: isLg ? "calc(100vh - 280px)" : "400px",
            overflowY: "auto"
          }}>
            {loading ? (
              <div style={{padding: "20px", textAlign: "center", color: "#6b7280"}}>
                Loading forums...
              </div>
            ) : forums.length === 0 ? (
              <div style={{padding: "20px", textAlign: "center", color: "#6b7280"}}>
                No forums available
              </div>
            ) : (
              forums.map(forum => (
                <div
                  key={forum.id}
                  onClick={() => handleForumClick(forum)}
                  style={{
                    padding: "16px",
                    borderBottom: "1px solid #f3f4f6",
                    cursor: "pointer",
                    backgroundColor: selectedForum?.id === forum.id ? "#f9fafb" : "white",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedForum?.id === forum.id ? "#f9fafb" : "white"}
                >
                  <div style={{fontSize: "16px", fontWeight: "600", color: "#111827", marginBottom: "4px"}}>
                    {forum.title}
                  </div>
                  <div style={{fontSize: "14px", color: "#6b7280", marginBottom: "8px"}}>
                    {forum.description}
                  </div>
                  <div style={{fontSize: "12px", color: "#9ca3af"}}>
                    {forum.course?.code} - {forum.course?.name}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Forum Details */}
        {(selectedForum || !isLg) && (
          <div style={{
            flex: "2",
            display: isLg ? "block" : (selectedForum ? "block" : "none")
          }}>
            {selectedForum ? (
              <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                height: "100%",
                display: "flex",
                flexDirection: "column"
              }}>
                {/* Forum Header */}
                <div style={{
                  padding: "20px",
                  borderBottom: "1px solid #e5e7eb"
                }}>
                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px"}}>
                    <h2 style={{margin: 0, fontSize: "20px", color: "#111827"}}>
                      {selectedForum.title}
                    </h2>
                    <button
                      onClick={() => setShowNewPost(true)}
                      style={{
                        background: C.blue,
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 16px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      New Post
                    </button>
                  </div>
                  <div style={{fontSize: "14px", color: "#6b7280"}}>
                    {selectedForum.description}
                  </div>
                  <div style={{fontSize: "12px", color: "#9ca3af", marginTop: "4px"}}>
                    {selectedForum.course?.code} - {selectedForum.course?.name}
                  </div>
                </div>

                {/* New Post Modal */}
                {showNewPost && (
                  <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000
                  }}>
                    <div style={{
                      backgroundColor: "white",
                      borderRadius: "8px",
                      padding: "24px",
                      width: isLg ? "500px" : "90%",
                      maxWidth: "500px"
                    }}>
                      <h3 style={{margin: "0 0 16px", fontSize: "18px", color: "#333"}}>Create New Post</h3>
                      <textarea
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        placeholder="Write your post here..."
                        style={{
                          width: "100%",
                          padding: "12px",
                          border: "1px solid #d1d5db",
                          borderRadius: "6px",
                          fontSize: "14px",
                          minHeight: "120px",
                          resize: "vertical",
                          marginBottom: "16px",
                          boxSizing: "border-box"
                        }}
                      />
                      <div style={{display: "flex", gap: "12px", justifyContent: "flex-end"}}>
                        <button
                          onClick={() => setShowNewPost(false)}
                          style={{
                            background: "#6b7280",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 16px",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreatePost}
                          style={{
                            background: C.blue,
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            padding: "8px 16px",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Posts */}
                <div style={{
                  padding: "20px",
                  flex: 1,
                  overflowY: "auto"
                }}>
                  {selectedForum.posts?.length === 0 ? (
                    <div style={{textAlign: "center", color: "#6b7280", padding: "40px"}}>
                      No posts yet. Be the first to start a discussion!
                    </div>
                  ) : (
                    selectedForum.posts?.map(post => (
                      <div key={post.id} style={{
                        marginBottom: "24px",
                        padding: "16px",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px"
                      }}>
                        <div style={{display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px"}}>
                          <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            backgroundColor: C.blue,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                            fontWeight: "600"
                          }}>
                            {post.author?.profile?.firstName?.[0] || post.author?.username?.[0] || 'U'}
                          </div>
                          <div style={{flex: 1}}>
                            <div style={{fontSize: "14px", fontWeight: "600", color: "#111827"}}>
                              {post.author?.profile?.firstName && post.author?.profile?.lastName 
                                ? `${post.author.profile.firstName} ${post.author.profile.lastName}`
                                : post.author?.username || 'Unknown'
                              }
                            </div>
                            <div style={{fontSize: "12px", color: "#6b7280"}}>
                              {formatDate(post.createdAt)}
                            </div>
                          </div>
                        </div>
                        <div style={{
                          fontSize: "14px",
                          lineHeight: "1.6",
                          color: "#374151",
                          marginBottom: "12px",
                          whiteSpace: "pre-wrap"
                        }}>
                          {post.content}
                        </div>
                        
                        {/* Replies */}
                        {post.replies?.length > 0 && (
                          <div style={{marginLeft: "52px"}}>
                            {post.replies.map(reply => (
                              <div key={reply.id} style={{
                                marginTop: "12px",
                                padding: "12px",
                                backgroundColor: "#f9fafb",
                                borderRadius: "6px"
                              }}>
                                <div style={{display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px"}}>
                                  <div style={{
                                    width: "32px",
                                    height: "32px",
                                    borderRadius: "50%",
                                    backgroundColor: "#6b7280",
                                    color: "white",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "12px",
                                    fontWeight: "600"
                                  }}>
                                    {reply.author?.profile?.firstName?.[0] || reply.author?.username?.[0] || 'U'}
                                  </div>
                                  <div style={{fontSize: "12px", fontWeight: "600", color: "#111827"}}>
                                    {reply.author?.profile?.firstName && reply.author?.profile?.lastName 
                                      ? `${reply.author.profile.firstName} ${reply.author.profile.lastName}`
                                      : reply.author?.username || 'Unknown'
                                    }
                                  </div>
                                  <div style={{fontSize: "11px", color: "#6b7280"}}>
                                    {formatDate(reply.createdAt)}
                                  </div>
                                </div>
                                <div style={{
                                  fontSize: "13px",
                                  lineHeight: "1.5",
                                  color: "#374151",
                                  whiteSpace: "pre-wrap"
                                }}>
                                  {reply.content}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {/* Reply Input */}
                        <div style={{marginLeft: "52px", marginTop: "12px"}}>
                          {replyingTo === post.id ? (
                            <div style={{display: "flex", gap: "8px", alignItems: "flex-end"}}>
                              <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                style={{
                                  flex: 1,
                                  padding: "8px",
                                  border: "1px solid #d1d5db",
                                  borderRadius: "6px",
                                  fontSize: "14px",
                                  minHeight: "60px",
                                  resize: "vertical",
                                  boxSizing: "border-box"
                                }}
                              />
                              <div style={{display: "flex", gap: "8px"}}>
                                <button
                                  onClick={() => {setReplyingTo(null); setReplyContent('');}}
                                  style={{
                                    background: "#6b7280",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "6px 12px",
                                    fontSize: "12px",
                                    cursor: "pointer"
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleReply(post.id)}
                                  style={{
                                    background: C.blue,
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "6px 12px",
                                    fontSize: "12px",
                                    cursor: "pointer"
                                  }}
                                >
                                  Reply
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setReplyingTo(post.id)}
                              style={{
                                background: "none",
                                border: "1px solid #d1d5db",
                                borderRadius: "4px",
                                padding: "6px 12px",
                                fontSize: "12px",
                                color: "#6b7280",
                                cursor: "pointer"
                              }}
                            >
                              Reply
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280"
              }}>
                <div style={{textAlign: "center"}}>
                  <div style={{fontSize: "48px", marginBottom: "16px"}}>forum</div>
                  <div style={{fontSize: "18px", fontWeight: "600"}}>Select a forum</div>
                  <div style={{fontSize: "14px", marginTop: "8px"}}>Choose a forum from the list to view discussions</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
