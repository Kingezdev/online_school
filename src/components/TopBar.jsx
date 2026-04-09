import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { useState, useEffect } from 'react';
import { authAPI } from '../utils/api.js';

export function TopBar({ role, setRole, setPage, currentPage }) {
  const w = useW();
  const isLg = w >= 1024;
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showSemesterDropdown, setShowSemesterDropdown] = useState(false);
  const [showResourcesDropdown, setShowResourcesDropdown] = useState(false);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedYear, setSelectedYear] = useState('2025/2026');
  const [selectedSemester, setSelectedSemester] = useState('Semester One');
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Close search dropdown when clicking outside or pressing ESC
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSearch && !event.target.closest('.search-container')) {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && showSearch) {
        setShowSearch(false);
        setSearchQuery('');
        setSearchResults([]);
      }
    };

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSearch]);

  // Cleanup search timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    try {
      // Import booksAPI dynamically to avoid circular dependency
      const { booksAPI } = await import('../utils/api.js');
      const response = await booksAPI.search(query);
      
      if (response.success) {
        setSearchResults(response.books || []);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSearchInputChange = (value) => {
    setSearchQuery(value);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for search
    const timeout = setTimeout(() => {
      handleSearch(value);
    }, 300); // 300ms debounce
    
    setSearchTimeout(timeout);
  };

  const handleResultClick = (result) => {
    // Navigate to library page with the selected book
    setPage("library");
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <div>
      {/* Main TopBar */}
      <div style={{backgroundColor: "#1a5f3f", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between", padding: isLg ? "24px" : "16px", height: isLg ? "56px" : "48px", position: "relative"}}>
        {/* Left side - Logo and University Name */}
        <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
          <img src="/ABU.jpeg" alt="ABU Logo" style={{height: isLg ? "32px" : "24px", width: "auto"}} />
          <div style={{display: isLg ? "block" : "none"}}>
            <div style={{fontSize: "12px", fontWeight: "bold"}}>DISTANCE LEARNING CENTRE</div>
            <div style={{fontSize: "12px", opacity: 0.9}}>AHMADU BELLO UNIVERSITY</div>
          </div>
        </div>

        {/* Center - Semester and Navigation */}
        <div style={{display: isLg ? "flex" : "none", alignItems: "center", gap: "16px"}}>
          <div style={{position: "relative"}}>
            <button 
              onClick={() => setShowYearDropdown(!showYearDropdown)}
              style={{fontSize: "12px", color: "white", transition: "color 0.2s", display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: "4px", border: "1px solid rgba(255, 255, 255, 0.2)"}}
            >
              {selectedYear}
              <svg style={{width: "12px", height: "12px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showYearDropdown && (
              <div style={{position: "absolute", top: "100%", left: 0, backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "4px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", zIndex: 50, minWidth: "120px", marginTop: "4px"}}>
                <button 
                  onClick={() => { setSelectedYear('2025/2026'); setShowYearDropdown(false); }}
                  style={{width: "100%", padding: "8px 12px", fontSize: "12px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left"}} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  2025/2026
                </button>
                <button 
                  onClick={() => { setSelectedYear('2024/2025'); setShowYearDropdown(false); }}
                  style={{width: "100%", padding: "8px 12px", fontSize: "12px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left"}} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  2024/2025
                </button>
                <button 
                  onClick={() => { setSelectedYear('2023/2024'); setShowYearDropdown(false); }}
                  style={{width: "100%", padding: "8px 12px", fontSize: "12px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left"}} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  2023/2024
                </button>
                <button 
                  onClick={() => { setSelectedYear('2022/2023'); setShowYearDropdown(false); }}
                  style={{width: "100%", padding: "8px 12px", fontSize: "12px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left"}} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  2022/2023
                </button>
                <button 
                  onClick={() => { setSelectedYear('2021/2022'); setShowYearDropdown(false); }}
                  style={{width: "100%", padding: "8px 12px", fontSize: "12px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left"}} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  2021/2022
                </button>
                <button 
                  onClick={() => { setSelectedYear('2020/2021'); setShowYearDropdown(false); }}
                  style={{width: "100%", padding: "8px 12px", fontSize: "12px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left"}} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  2020/2021
                </button>
                <button 
                  onClick={() => { setSelectedYear('2019/2020'); setShowYearDropdown(false); }}
                  style={{width: "100%", padding: "8px 12px", fontSize: "12px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left"}} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  2019/2020
                </button>
                <button 
                  onClick={() => { setSelectedYear('2018/2019'); setShowYearDropdown(false); }}
                  style={{width: "100%", padding: "8px 12px", fontSize: "12px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left"}} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  2018/2019
                </button>
                <button 
                  onClick={() => { setSelectedYear('2017/2018'); setShowYearDropdown(false); }}
                  style={{width: "100%", padding: "8px 12px", fontSize: "12px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left"}} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  2017/2018
                </button>
              </div>
            )}
          </div>
          <div style={{position: "relative"}}>
            <button 
              onClick={() => setShowSemesterDropdown(!showSemesterDropdown)}
              style={{fontSize: "12px", color: "white", transition: "color 0.2s", display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer"}}
            >
              {selectedSemester}
              <svg style={{width: "12px", height: "12px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showSemesterDropdown && (
              <div style={{position: "absolute", top: "100%", left: 0, backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "4px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", zIndex: 50, minWidth: "120px", marginTop: "4px"}}>
                <button 
                  onClick={() => { setSelectedSemester('Semester One'); setShowSemesterDropdown(false); }}
                  style={{width: "100%", padding: "8px 12px", fontSize: "12px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left"}} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  Semester One
                </button>
                <button 
                  onClick={() => { setSelectedSemester('Semester Two'); setShowSemesterDropdown(false); }}
                  style={{width: "100%", padding: "8px 12px", fontSize: "12px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left"}} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  Semester Two
                </button>
              </div>
            )}
          </div>
          <div style={{position: "relative"}}>
            <button 
              onClick={() => setShowResourcesDropdown(!showResourcesDropdown)}
              style={{fontSize: "12px", color: "white", transition: "color 0.2s", display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer"}}
            >
              Resources
              <svg style={{width: "12px", height: "12px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showResourcesDropdown && (
              <div style={{position: "absolute", top: "100%", left: 0, backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "4px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", zIndex: 50, minWidth: "120px", marginTop: "4px"}}>
                <button 
                  onClick={() => { setPage("library"); setShowResourcesDropdown(false); }}
                  style={{width: "100%", padding: "8px 12px", fontSize: "12px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left"}} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  Library
                </button>
                <button 
                  onClick={() => { setPage("downloads"); setShowResourcesDropdown(false); }}
                  style={{width: "100%", padding: "8px 12px", fontSize: "12px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left"}} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  Downloads
                </button>
                <button 
                  onClick={() => { setPage("help support"); setShowResourcesDropdown(false); }}
                  style={{width: "100%", padding: "8px 12px", fontSize: "12px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left"}} 
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"} 
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                >
                  Help Center
                </button>
              </div>
            )}
          </div>
          <div style={{position: "relative"}}>
            <button 
              onClick={() => setShowHelpDropdown(!showHelpDropdown)}
              style={{fontSize: "12px", color: "white", transition: "color 0.2s", display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer"}}
            >
              Help
              <svg style={{width: "12px", height: "12px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showHelpDropdown && (
              <div style={{position: "absolute", top: "100%", left: 0, backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "4px", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", zIndex: 50, minWidth: "120px", marginTop: "4px"}}>
                <button style={{width: "100%", padding: "8px 12px", fontSize: "12px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left"}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}>
                  FAQ
                </button>
                <button style={{width: "100%", padding: "8px 12px", fontSize: "12px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left"}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}>
                  Contact Support
                </button>
                <button style={{width: "100%", padding: "8px 12px", fontSize: "12px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left"}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}>
                  Documentation
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right side - Notifications and Profile */}
        <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
          {/* Search */}
          <div style={{position: "relative"}} className="search-container">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              style={{color: "white", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer", padding: "8px"}}
            >
              <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Search Dropdown */}
            {showSearch && (
              <div style={{
                position: "absolute", 
                top: "100%", 
                right: 0, 
                backgroundColor: "white", 
                border: "1px solid #e5e7eb", 
                borderRadius: "8px", 
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)", 
                zIndex: 50, 
                width: "320px", 
                marginTop: "8px"
              }}>
                {/* Search Input */}
                <div style={{padding: "12px", borderBottom: "1px solid #e5e7eb"}}>
                  <input
                    type="text"
                    placeholder="Search books, courses, resources..."
                    value={searchQuery}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    autoFocus
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #d1d5db",
                      borderRadius: "6px",
                      fontSize: "14px",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
                
                {/* Search Results */}
                <div style={{maxHeight: "300px", overflowY: "auto"}}>
                  {searchLoading ? (
                    <div style={{padding: "20px", textAlign: "center", color: "#6b7280", fontSize: "14px"}}>
                      Searching...
                    </div>
                  ) : searchResults.length === 0 && searchQuery ? (
                    <div style={{padding: "20px", textAlign: "center", color: "#6b7280", fontSize: "14px"}}>
                      No results found for "{searchQuery}"
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map(result => (
                      <div
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        style={{
                          padding: "12px",
                          borderBottom: "1px solid #f3f4f6",
                          cursor: "pointer",
                          transition: "background 0.2s"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                      >
                        <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                          <div style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "6px",
                            backgroundColor: "#f3f4f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#6b7280",
                            fontSize: "12px",
                            fontWeight: "600"
                          }}>
                            BOOK
                          </div>
                          <div style={{flex: 1}}>
                            <div style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "#111827",
                              marginBottom: "2px"
                            }}>
                              {result.title}
                            </div>
                            <div style={{
                              fontSize: "12px",
                              color: "#6b7280",
                              marginBottom: "2px"
                            }}>
                              by {result.author}
                            </div>
                            <div style={{
                              fontSize: "11px",
                              color: "#9ca3af"
                            }}>
                              {result.genre} · ISBN: {result.isbn}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{padding: "20px", textAlign: "center", color: "#6b7280", fontSize: "14px"}}>
                      Search for books, courses, and resources
                    </div>
                  )}
                </div>
                
                {/* Search Footer */}
                <div style={{
                  padding: "8px 12px",
                  borderTop: "1px solid #e5e7eb",
                  fontSize: "12px",
                  color: "#6b7280",
                  textAlign: "center"
                }}>
                  Press ESC to close
                </div>
              </div>
            )}
          </div>
          <button style={{color: "white", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer", padding: "8px"}}>
            <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118.967 15H6.033a2.032 2.032 0 01-1.405-1.405L3.523 17H5m0 0h14m-7-7h.01M12 3v14m0 0l-3.5-3.5M12 14l3.5-3.5" />
            </svg>
          </button>
                    
          {/* Messages */}
          <div style={{position: "relative"}}>
            <button 
              onClick={() => setPage("messages")}
              style={{color: "white", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer", padding: "8px"}}
            >
              <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </button>
          </div>

          {/* Notifications */}
          <div style={{position: "relative"}}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              style={{color: "white", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer", padding: "8px"}}
            >
              <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span style={{position: "absolute", top: "-4px", right: "-4px", backgroundColor: "#dc2626", color: "white", fontSize: "12px", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center"}}>3</span>
            </button>
          </div>

          {/* Profile */}
          <div style={{position: "relative"}}>
            <button 
              onClick={() => setShowProfile(!showProfile)}
              style={{color: "white", transition: "color 0.2s", background: "none", border: "none", cursor: "pointer", padding: "8px", display: "flex", alignItems: "center", gap: "8px"}}
            >
              <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span style={{fontSize: "12px"}}>{user ? `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}` : 'Loading...'}</span>
              <svg style={{width: "16px", height: "16px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Profile Dropdown Menu */}
            {showProfile && (
              <div style={{position: "absolute", top: "100%", right: 0, backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px", boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)", zIndex: 50, minWidth: "200px", marginTop: "8px"}}>
                {/* User Info Header */}
                <div style={{padding: "16px", borderBottom: "1px solid #e5e7eb"}}>
                  <div style={{display: "flex", alignItems: "center", gap: "12px"}}>
                    <div style={{width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "16px", fontWeight: "bold"}}>
                      {user ? `${user.profile?.firstName?.charAt(0) || ''}${user.profile?.lastName?.charAt(0) || ''}`.toUpperCase() : 'U'}
                    </div>
                    <div>
                      <div style={{fontSize: "14px", fontWeight: "600", color: "#111827", marginBottom: "2px"}}>
                        {user ? `${user.profile?.firstName || ''} ${user.profile?.lastName || ''}` : 'Loading...'}
                      </div>
                      <div style={{fontSize: "12px", color: "#6b7280"}}>
                        {user ? `${user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || ''} ${user.profile?.department || ''}` : 'Loading...'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div style={{padding: "8px 0"}}>
                  <button 
                    onClick={() => {
                      if (role === "student") {
                        setPage("my profile");
                      } else {
                        setPage("staff profile");
                      }
                      setShowProfile(false);
                    }}
                    style={{width: "100%", padding: "10px 16px", fontSize: "13px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "12px"}} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                  >
                    <svg style={{width: "16px", height: "16px", color: "#6b7280"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </button>
                  
                                    
                  <button 
                    onClick={() => {
                      setPage("help support");
                      setShowProfile(false);
                    }}
                    style={{width: "100%", padding: "10px 16px", fontSize: "13px", color: "#374151", background: "none", border: "none", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "12px"}} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                  >
                    <svg style={{width: "16px", height: "16px", color: "#6b7280"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Help & Support
                  </button>
                  
                  <div style={{height: "1px", backgroundColor: "#e5e7eb", margin: "8px 16px"}}></div>
                  
                  <button 
                    onClick={() => {
                      // Handle logout
                      console.log("Logging out...");
                      setRole(); // This will trigger logout and return to homepage
                    }}
                    style={{
                      width: "100%", 
                      padding: "10px 16px", 
                      fontSize: "13px", 
                      color: "#dc2626", 
                      background: "none", 
                      border: "none", 
                      cursor: "pointer", 
                      textAlign: "left", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "12px"
                    }} 
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fef2f2"} 
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                  >
                    <svg style={{width: "16px", height: "16px", color: "#dc2626"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3V4z" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Navigation Bar */}
      <div style={{backgroundColor: "white", borderBottom: "1px solid #e5e7eb", padding: "8px 16px"}}>
        <div style={{display: "flex", alignItems: "center", gap: "24px"}}>
          {role === "admin" ? (
            // Admin Navigation
            <>
              <button 
                onClick={() => {
                  console.log("Dashboard clicked");
                  setPage("dashboard");
                }}
                style={{color: currentPage === "dashboard" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "dashboard" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </button>
              <button 
                onClick={() => setPage("users")}
                style={{color: currentPage === "users" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "users" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Users
              </button>
              <button 
                onClick={() => setPage("courses")}
                style={{color: currentPage === "courses" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "courses" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Courses
              </button>
                            <button 
                onClick={() => setPage("reports")}
                style={{color: currentPage === "reports" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "reports" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Reports
              </button>
              <button 
                onClick={() => setPage("settings")}
                style={{color: currentPage === "settings" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "settings" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <button 
                onClick={() => setPage("logs")}
                style={{color: currentPage === "logs" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "logs" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Logs
              </button>
            </>
          ) : role === "lecturer" ? (
            // Lecturer Navigation
            <>
              <button 
                onClick={() => {
                  console.log("Dashboard clicked");
                  setPage("dashboard");
                }}
                style={{color: currentPage === "dashboard" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "dashboard" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </button>
              <button 
                onClick={() => setPage("my courses")}
                style={{color: currentPage === "my courses" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "my courses" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                My Courses
              </button>
              <button 
                onClick={() => setPage("grade book")}
                style={{color: currentPage === "grade book" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "grade book" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6m9-9V5a1 1 0 00-1-1H9a1 1 0 00-1 1v1m3 3h6" />
                </svg>
                Grade Book
              </button>
              <button 
                onClick={() => setPage("attendance")}
                style={{color: currentPage === "attendance" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "attendance" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Attendance
              </button>
              <button 
                onClick={() => setPage("assignments")}
                style={{color: currentPage === "assignments" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "assignments" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Assignments
              </button>
              <button 
                onClick={() => setPage("forum")}
                style={{color: currentPage === "forum" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "forum" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                Forum
              </button>
              <button 
                onClick={() => setPage("reports")}
                style={{color: currentPage === "reports" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "reports" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6m9-9V5a1 1 0 00-1-1H9a1 1 0 00-1 1v1m3 3h6" />
                </svg>
                Reports
              </button>
              <button 
                onClick={() => setPage("extras")}
                style={{color: currentPage === "extras" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "extras" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Extra
              </button>
            </>
          ) : (
            // Student Navigation (existing)
            <>
              <button 
                onClick={() => {
                  console.log("Dashboard clicked");
                  setPage("dashboard");
                }}
                style={{color: currentPage === "dashboard" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "dashboard" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </button>
              <button 
                onClick={() => {
                  console.log("My Courses clicked");
                  setPage("my courses");
                }}
                style={{color: currentPage === "my courses" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "my courses" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                My Courses
              </button>
              <button 
                onClick={() => {
                  console.log("Grade Book clicked");
                  setPage("grade book");
                }}
                style={{color: currentPage === "grade book" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "grade book" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a1 1 0 001 1h4a1 1 0 001-1v-1m3-2V8a2 2 0 00-2-2H8a2 2 0 00-2 2v6m9-9V5a1 1 0 00-1-1H9a1 1 0 00-1 1v1m3 3h6" />
                </svg>
                Grade Book
              </button>
              <button 
                onClick={() => {
                  console.log("Forum clicked");
                  setPage("forum");
                }}
                style={{color: currentPage === "forum" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "forum" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                Forum
              </button>
              <button 
                onClick={() => setPage("assignment")}
                style={{color: currentPage === "assignment" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "assignment" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                Assignment
              </button>
              <button 
                onClick={() => setPage("studio")}
                style={{color: currentPage === "studio" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "studio" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Studio
              </button>
              <button 
                onClick={() => setPage("extras")}
                style={{color: currentPage === "extras" ? "#2563eb" : "#6b7280", fontWeight: currentPage === "extras" ? "bold" : "normal", fontSize: "14px", background: "none", border: "none", cursor: "pointer", padding: "4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px"}}
              >
                <svg style={{width: "20px", height: "20px"}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Extra
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
