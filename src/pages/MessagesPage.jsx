import { useState, useEffect } from 'react';
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { messagesAPI } from '../utils/api.js';

export function MessagesPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({
    receiverId: '',
    subject: '',
    content: ''
  });

  const tabs = [
    { id: 'all', label: 'All Messages', count: null },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'read', label: 'Read', count: null },
    { id: 'sent', label: 'Sent', count: null }
  ];

  useEffect(() => {
    fetchMessages();
    fetchUnreadCount();
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getAll(activeTab);
      
      if (response.success) {
        setMessages(response.messages || []);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await messagesAPI.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.unreadCount);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const handleMessageClick = async (message) => {
    setSelectedMessage(message);
    
    // Mark as read if it's unread and user is the receiver
    if (!message.isRead && message.receiverId === getCurrentUserId()) {
      try {
        await messagesAPI.markAsRead(message.id);
        // Update the message in the list
        setMessages(prev => prev.map(m => 
          m.id === message.id ? { ...m, isRead: true } : m
        ));
        fetchUnreadCount();
      } catch (error) {
        console.error('Failed to mark message as read:', error);
      }
    }
  };

  const getCurrentUserId = () => {
    // This would typically come from auth context or state
    return 1; // Placeholder - should get actual user ID
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await messagesAPI.delete(messageId);
      setMessages(prev => prev.filter(m => m.id !== messageId));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      fetchUnreadCount();
    } catch (error) {
      setError(error.message || 'Failed to delete message');
    }
  };

  const handleMarkAsUnread = async (messageId) => {
    try {
      await messagesAPI.markAsUnread(messageId);
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, isRead: false } : m
      ));
      fetchUnreadCount();
    } catch (error) {
      setError(error.message || 'Failed to mark message as unread');
    }
  };

  const handleSendMessage = async () => {
    try {
      const response = await messagesAPI.send(composeData);
      if (response.success) {
        setShowCompose(false);
        setComposeData({ receiverId: '', subject: '', content: '' });
        fetchMessages();
      }
    } catch (error) {
      setError(error.message || 'Failed to send message');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#f59e0b';
      case 'normal': return '#6b7280';
      default: return '#6b7280';
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
    <div style={{ padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: isLg ? "28px" : "24px", color: "#333", fontWeight: "bold" }}>
          Messages
        </h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setShowCompose(true)}
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
            Compose
          </button>
          <button
            onClick={() => setPage("dashboard")}
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

      {/* Compose Modal */}
      {showCompose && (
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
            <h2 style={{ margin: "0 0 16px", fontSize: "20px", color: "#333" }}>New Message</h2>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#374151" }}>
                To (User ID):
              </label>
              <input
                type="text"
                value={composeData.receiverId}
                onChange={(e) => setComposeData(prev => ({ ...prev, receiverId: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
                placeholder="Enter receiver's user ID"
              />
            </div>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#374151" }}>
                Subject:
              </label>
              <input
                type="text"
                value={composeData.subject}
                onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
                placeholder="Enter subject"
              />
            </div>
            
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "4px", fontSize: "14px", color: "#374151" }}>
                Message:
              </label>
              <textarea
                value={composeData.content}
                onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  minHeight: "120px",
                  resize: "vertical",
                  boxSizing: "border-box"
                }}
                placeholder="Type your message here..."
              />
            </div>
            
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowCompose(false)}
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
                onClick={handleSendMessage}
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
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "24px", height: "calc(100vh - 180px)" }}>
        {/* Messages List */}
        <div style={{
          flex: isLg ? "1" : "none",
          maxWidth: isLg ? "400px" : "100%",
          display: isLg ? "block" : (selectedMessage ? "none" : "block")
        }}>
          {/* Tabs */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            padding: "4px",
            marginBottom: "16px",
            display: "flex",
            gap: "4px"
          }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  backgroundColor: activeTab === tab.id ? C.blue : "transparent",
                  color: activeTab === tab.id ? "white" : "#6b7280",
                  transition: "all 0.2s"
                }}
              >
                {tab.label}
                {tab.count !== null && tab.count > 0 && (
                  <span style={{
                    marginLeft: "4px",
                    backgroundColor: activeTab === tab.id ? "rgba(255, 255, 255, 0.2)" : "#e5e7eb",
                    color: activeTab === tab.id ? "white" : "#6b7280",
                    padding: "2px 6px",
                    borderRadius: "10px",
                    fontSize: "12px"
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Messages List */}
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            border: "1px solid #e5e7eb",
            maxHeight: isLg ? "calc(100vh - 280px)" : "400px",
            overflowY: "auto"
          }}>
            {loading ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>
                No messages found
              </div>
            ) : (
              messages.map(message => (
                <div
                  key={message.id}
                  onClick={() => handleMessageClick(message)}
                  style={{
                    padding: "16px",
                    borderBottom: "1px solid #f3f4f6",
                    cursor: "pointer",
                    backgroundColor: selectedMessage?.id === message.id ? "#f9fafb" : "white",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = selectedMessage?.id === message.id ? "#f9fafb" : "white"}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
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
                      fontWeight: "600",
                      flexShrink: 0
                    }}>
                      {message.sender?.firstName?.[0] || message.sender?.username?.[0] || 'U'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                        <div style={{ fontSize: "14px", fontWeight: message.isRead ? "400" : "600", color: "#111827" }}>
                          {message.sender?.firstName && message.sender?.lastName 
                            ? `${message.sender.firstName} ${message.sender.lastName}`
                            : message.sender?.username || 'Unknown'
                          }
                        </div>
                        <div style={{ fontSize: "12px", color: "#6b7280", whiteSpace: "nowrap" }}>
                          {formatDate(message.createdAt)}
                        </div>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: message.isRead ? "400" : "600", color: "#111827", marginBottom: "2px" }}>
                        {message.subject}
                      </div>
                      <div style={{ fontSize: "13px", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {message.content}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                        {!message.isRead && (
                          <span style={{
                            backgroundColor: "#3b82f6",
                            color: "white",
                            fontSize: "10px",
                            padding: "2px 6px",
                            borderRadius: "10px",
                            fontWeight: "600"
                          }}>
                            NEW
                          </span>
                        )}
                        <span style={{
                          fontSize: "11px",
                          color: getPriorityColor(message.priority),
                          fontWeight: "600"
                        }}>
                          {message.priority?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Detail */}
        {(selectedMessage || !isLg) && (
          <div style={{
            flex: "2",
            display: isLg ? "block" : (selectedMessage ? "block" : "none")
          }}>
            {selectedMessage ? (
              <div style={{
                backgroundColor: "white",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                height: "100%",
                display: "flex",
                flexDirection: "column"
              }}>
                {/* Message Header */}
                <div style={{
                  padding: "20px",
                  borderBottom: "1px solid #e5e7eb"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <h2 style={{ margin: 0, fontSize: "18px", color: "#111827" }}>
                      {selectedMessage.subject}
                    </h2>
                    <div style={{ display: "flex", gap: "8px" }}>
                      {selectedMessage.receiverId === getCurrentUserId() && (
                        <button
                          onClick={() => handleMarkAsUnread(selectedMessage.id)}
                          style={{
                            background: "#f3f4f6",
                            color: "#374151",
                            border: "none",
                            borderRadius: "4px",
                            padding: "6px 12px",
                            fontSize: "12px",
                            cursor: "pointer"
                          }}
                        >
                          Mark Unread
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteMessage(selectedMessage.id)}
                        style={{
                          background: "#fee",
                          color: "#dc2626",
                          border: "none",
                          borderRadius: "4px",
                          padding: "6px 12px",
                          fontSize: "12px",
                          cursor: "pointer"
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "#6b7280" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: C.blue,
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: "600"
                      }}>
                        {selectedMessage.sender?.firstName?.[0] || selectedMessage.sender?.username?.[0] || 'U'}
                      </div>
                      <div>
                        <div style={{ fontWeight: "600", color: "#111827" }}>
                          {selectedMessage.sender?.firstName && selectedMessage.sender?.lastName 
                            ? `${selectedMessage.sender.firstName} ${selectedMessage.sender.lastName}`
                            : selectedMessage.sender?.username || 'Unknown'
                          }
                        </div>
                        <div style={{ fontSize: "12px" }}>
                          {formatDate(selectedMessage.createdAt)}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      fontSize: "11px",
                      color: getPriorityColor(selectedMessage.priority),
                      fontWeight: "600",
                      padding: "2px 8px",
                      backgroundColor: `${getPriorityColor(selectedMessage.priority)}20`,
                      borderRadius: "10px"
                    }}>
                      {selectedMessage.priority?.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Message Content */}
                <div style={{
                  padding: "20px",
                  flex: 1,
                  overflowY: "auto"
                }}>
                  <div style={{
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "#374151",
                    whiteSpace: "pre-wrap"
                  }}>
                    {selectedMessage.content}
                  </div>
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
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "48px", marginBottom: "16px" }}> inbox</div>
                  <div style={{ fontSize: "18px", fontWeight: "600" }}>Select a message</div>
                  <div style={{ fontSize: "14px", marginTop: "8px" }}>Choose a message from the list to read it</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
