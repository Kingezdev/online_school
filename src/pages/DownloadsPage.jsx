import { useState, useEffect } from 'react';
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { booksAPI } from '../utils/api.js';

export function DownloadsPage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [downloadingBookId, setDownloadingBookId] = useState(null);

  const genres = [
    'All', 'Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Engineering', 'Business', 'Literature', 'History', 'Philosophy', 'Psychology',
    'Sociology', 'Economics', 'Law', 'Medicine', 'Education', 'General'
  ];

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      searchBooks();
    } else {
      fetchBooks();
    }
  }, [searchTerm]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.getAll();
      
      if (response.success) {
        let filteredBooks = response.books;
        
        if (selectedGenre !== 'All') {
          filteredBooks = filteredBooks.filter(book => book.genre === selectedGenre);
        }
        
        setBooks(filteredBooks);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  const searchBooks = async () => {
    try {
      setLoading(true);
      const response = await booksAPI.search(searchTerm);
      
      if (response.success) {
        let filteredBooks = response.books;
        
        if (selectedGenre !== 'All') {
          filteredBooks = filteredBooks.filter(book => book.genre === selectedGenre);
        }
        
        setBooks(filteredBooks);
      }
    } catch (error) {
      setError(error.message || 'Failed to search books');
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
    if (searchTerm) {
      searchBooks();
    } else {
      fetchBooks();
    }
  };

  const handleDownload = async (bookId) => {
    try {
      setDownloadingBookId(bookId);
      await booksAPI.download(bookId);
    } catch (error) {
      setError(error.message || 'Failed to download book');
    } finally {
      setDownloadingBookId(null);
    }
  };

  const getFileSize = () => {
    // Simulate file size based on book title and author length
    return Math.floor(Math.random() * 500) + 100; // 100-600 KB
  };

  return (
    <div style={{ padding: isLg ? "32px" : "16px", backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: isLg ? "28px" : "24px", color: "#333", fontWeight: "bold" }}>
          Downloads
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

      {/* Search and Filters */}
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "24px",
        border: "1px solid #e5e7eb"
      }}>
        <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px" }}>
            <input
              type="text"
              placeholder="Search by title, author, ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px"
              }}
            />
          </div>
          <div style={{ minWidth: "150px" }}>
            <select
              value={selectedGenre}
              onChange={(e) => handleGenreChange(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px"
              }}
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div style={{ fontSize: "14px", color: "#6b7280" }}>
          {books.length} downloadable books available
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

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: "16px", color: "#6b7280" }}>Loading downloadable books...</div>
        </div>
      ) : (
        <>
          {/* Books Grid */}
          {books.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "60px 20px",
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #e5e7eb"
            }}>
              <div style={{ fontSize: "18px", color: "#6b7280", marginBottom: "8px" }}>
                No downloadable books found
              </div>
              <div style={{ fontSize: "14px", color: "#9ca3af" }}>
                Try adjusting your search or filters
              </div>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: isLg ? "repeat(auto-fill, minmax(350px, 1fr))" : "1fr",
              gap: "20px"
            }}>
              {books.map(book => (
                <div
                  key={book.id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "8px",
                    padding: "20px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s, box-shadow 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <div style={{ marginBottom: "16px" }}>
                    <h3 style={{
                      margin: "0 0 8px",
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#333",
                      lineHeight: "1.4"
                    }}>
                      {book.title}
                    </h3>
                    <p style={{
                      margin: "0 0 4px",
                      fontSize: "14px",
                      color: "#6b7280"
                    }}>
                      by {book.author}
                    </p>
                    <p style={{
                      margin: "0 0 4px",
                      fontSize: "12px",
                      color: "#9ca3af"
                    }}>
                      ISBN: {book.isbn}
                    </p>
                  </div>

                  <div style={{ marginBottom: "12px" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      fontSize: "12px",
                      borderRadius: "4px",
                      marginBottom: "4px"
                    }}>
                      {book.genre}
                    </span>
                  </div>

                  {book.description && (
                    <p style={{
                      margin: "0 0 12px",
                      fontSize: "13px",
                      color: "#6b7280",
                      lineHeight: "1.4",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}>
                      {book.description}
                    </p>
                  )}

                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "12px",
                    borderTop: "1px solid #e5e7eb",
                    marginBottom: "12px"
                  }}>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      <div>Format: TXT</div>
                      <div>Size: ~{getFileSize()} KB</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{
                        padding: "4px 8px",
                        backgroundColor: "#10b98120",
                        color: "#10b981",
                        fontSize: "12px",
                        fontWeight: "600",
                        borderRadius: "4px"
                      }}>
                        Available
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(book.id)}
                    disabled={downloadingBookId === book.id}
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: downloadingBookId === book.id ? "#ccc" : C.blue,
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: downloadingBookId === book.id ? "not-allowed" : "pointer",
                      transition: "background 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px"
                    }}
                    onMouseEnter={(e) => {
                      if (downloadingBookId !== book.id) {
                        e.currentTarget.style.background = "#1e40af";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (downloadingBookId !== book.id) {
                        e.currentTarget.style.background = C.blue;
                      }
                    }}
                  >
                    {downloadingBookId === book.id ? (
                      <>
                        <div style={{
                          width: "16px",
                          height: "16px",
                          border: "2px solid #ffffff",
                          borderTop: "2px solid transparent",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite"
                        }}></div>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <svg style={{ width: "16px", height: "16px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Download
                      </>
                    )}
                  </button>

                  <style jsx>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
