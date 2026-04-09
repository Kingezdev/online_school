import { useState, useEffect } from 'react';
import { useW } from '../hooks/useW.js';
import { C } from '../data/constants.js';
import { SectionCard, Badge } from '../components/shared/SectionCard.jsx';
import { QRCodeGenerator } from '../components/QRCodeGenerator.jsx';
import { attendanceAPI } from '../utils/api.js';

export function StudentQRAttendancePage({ setPage }) {
  const w = useW();
  const isLg = w >= 1024;

  const [activeQRCodes, setActiveQRCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [showPopup, setShowPopup] = useState(null);

  useEffect(() => {
    fetchActiveQRCodes();
    // Refresh every 30 seconds
    const interval = setInterval(fetchActiveQRCodes, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchActiveQRCodes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await attendanceAPI.getActiveQRCodes();
      
      if (response.success) {
        setActiveQRCodes(response.activeQRCodes || []);
      } else {
        setError('Failed to fetch active QR codes');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch active QR codes');
    } finally {
      setLoading(false);
    }
  };

  const handleScanQRCode = async (qrData) => {
    try {
      setScanning(true);
      setScanResult(null);
      
      const response = await attendanceAPI.markAttendanceViaQR(qrData);
      
      if (response.success) {
        setScanResult({ success: true, message: response.message });
        setShowPopup('success');
        // Refresh the active QR codes
        await fetchActiveQRCodes();
      } else {
        setScanResult({ success: false, message: response.message });
        setShowPopup('failed');
        // Check if QR code expired and refresh the list
        if (response.message && (
          response.message.includes('expired') || 
          response.message.includes('not active') ||
          response.message.includes('invalid')
        )) {
          // Automatically remove expired QR codes by refreshing the list
          setTimeout(() => {
            fetchActiveQRCodes();
          }, 1000);
        }
      }
    } catch (error) {
      const errorMessage = error.message || 'Failed to scan QR code';
      setScanResult({ success: false, message: errorMessage });
      setShowPopup('failed');
      
      // Check if QR code expired and refresh the list
      if (errorMessage && (
        errorMessage.includes('expired') || 
        errorMessage.includes('not active') ||
        errorMessage.includes('invalid')
      )) {
        // Automatically remove expired QR codes by refreshing the list
        setTimeout(() => {
          fetchActiveQRCodes();
        }, 1000);
      }
    } finally {
      setScanning(false);
      setTimeout(() => setShowPopup(null), 3000);
    }
  };

  const simulateQRScan = (qrData) => {
    // Simulate QR code scanning process
    setScanning(true);
    setTimeout(() => {
      const success = Math.random() > 0.2; // 80% success rate for demo
      if (success) {
        handleScanQRCode(JSON.stringify(qrData));
      } else {
        setScanResult({ success: false, message: 'Scan failed. Please try again.' });
        setShowPopup('failed');
        setScanning(false);
        setTimeout(() => setShowPopup(null), 3000);
      }
    }, 2000);
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div style={{ padding: isLg ? "24px 32px" : 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <h2 style={{ margin: 0, fontSize: isLg ? 20 : 15, color: "#333", fontWeight: 700 }}>
          QR Attendance Scanner
        </h2>
        <button
          onClick={() => setPage('dashboard')}
          style={{
            background: "transparent",
            border: "1px solid #ddd",
            borderRadius: 6,
            padding: "8px 16px",
            fontSize: 12,
            cursor: "pointer",
            color: "#666"
          }}
        >
          Back to Dashboard
        </button>
      </div>
      <div style={{ fontSize: 12, color: "#aaa", marginBottom: 16 }}>Home / QR Attendance</div>

      {/* Scan Result Popups */}
      {showPopup && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 2000,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{
            background: showPopup === 'success' ? C.green : C.red,
            color: 'white',
            padding: '12px 16px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '200px'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {showPopup === 'success' ? '!' : 'X'}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '600', marginBottom: '1px' }}>
                {showPopup === 'success' ? 'Success!' : 'Failed!'}
              </div>
              <div style={{ fontSize: '10px', opacity: 0.9 }}>
                {scanResult?.message}
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
          <div style={{ fontSize: "16px", color: "#6b7280" }}>Loading active QR codes...</div>
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
          <div style={{ fontSize: "16px", color: "#ef4444", marginBottom: 16 }}>Error: {error}</div>
          <button
            onClick={fetchActiveQRCodes}
            style={{
              background: C.blue,
              color: "white",
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      ) : activeQRCodes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", background: "white", borderRadius: "8px", border: "1px solid #e0e0e0" }}>
          <div style={{ fontSize: 48, marginBottom: 16, color: "#ccc" }}>QR</div>
          <div style={{ fontSize: 16, color: "#666", marginBottom: 8 }}>No Active QR Codes</div>
          <div style={{ fontSize: 12, color: "#999", marginBottom: 16 }}>
            Your lecturers haven't activated any QR codes for attendance yet.
          </div>
          <div style={{ fontSize: 11, color: "#aaa" }}>
            This page will automatically refresh when new QR codes become available.
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: isLg ? "repeat(auto-fit, minmax(300px, 1fr))" : "1fr", gap: 16 }}>
          {activeQRCodes.map((qrCode, index) => (
            <SectionCard key={index} title={qrCode.code} icon="QR" color={C.blue}>
              <div style={{ padding: "16px" }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 4 }}>
                    {qrCode.name}
                  </div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
                    {qrCode.qrData.sessionLabel} - {qrCode.qrData.date}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Badge color={C.green}>
                      {getTimeRemaining(qrCode.expiresAt)}
                    </Badge>
                    <div style={{ fontSize: 11, color: "#888" }}>
                      Expires: {new Date(qrCode.expiresAt).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "center", marginBottom: 16 }}>
                  <QRCodeGenerator 
                    courseCode={qrCode.code || qrData.courseCode || 'Unknown'}
                    date={qrCode.qrData.date}
                    sessionLabel={qrCode.qrData.sessionLabel}
                    onScanSuccess={() => {
                      setScanResult({ success: true, message: 'QR code scanned successfully!' });
                      setShowPopup('success');
                      setTimeout(() => setShowPopup(null), 3000);
                      // Remove this QR code from active list after successful scan
                      setActiveQRCodes(prev => prev.filter(qr => 
                        !(qr.code === qrCode.code && qr.qrData.date === qrCode.qrData.date)
                      ));
                    }}
                    onScanFailed={() => {
                      setScanResult({ success: false, message: 'QR code scan failed. Please try again.' });
                      setShowPopup('failed');
                      setTimeout(() => setShowPopup(null), 3000);
                    }}
                  />
                  <div style={{ fontSize: 11, color: "#666", marginTop: 8 }}>
                    QR Code for {qrCode.code}
                  </div>
                </div>

                <button
                  onClick={() => simulateQRScan(qrCode.qrData)}
                  disabled={scanning}
                  style={{
                    width: "100%",
                    background: scanning ? "#ccc" : C.blue,
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 16px",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: scanning ? "not-allowed" : "pointer"
                  }}
                >
                  {scanning ? "Scanning..." : "Scan QR Code"}
                </button>
              </div>
            </SectionCard>
          ))}
        </div>
      )}

      {/* Add CSS animation */}
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
