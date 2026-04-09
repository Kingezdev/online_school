import { useState, useEffect } from 'react';
import { C } from '../data/constants.js';

export function QRCodeGenerator({ courseCode, date, sessionLabel, onScanSuccess, onScanFailed }) {
  const [qrData, setQrData] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    // Generate QR code data
    const data = JSON.stringify({
      courseCode,
      date,
      sessionLabel,
      timestamp: new Date().toISOString(),
      type: 'attendance',
      id: Math.random().toString(36).substr(2, 9)
    });
    setQrData(data);
  }, [courseCode, date, sessionLabel]);

  const generateQRCode = () => {
    const size = 200;
    const cellSize = 4;
    const cells = 25; // Standard QR code size (25x25 for version 2)
    
    // Initialize empty QR matrix
    const qrMatrix = Array(cells).fill(null).map(() => Array(cells).fill(false));
    
    // Add position markers (corner squares)
    const addPositionMarker = (startRow, startCol) => {
      // 7x7 position marker pattern
      const marker = [
        [1,1,1,1,1,1,1],
        [1,0,0,0,0,0,1],
        [1,0,1,1,1,0,1],
        [1,0,1,1,1,0,1],
        [1,0,1,1,1,0,1],
        [1,0,0,0,0,0,1],
        [1,1,1,1,1,1,1]
      ];
      
      for (let row = 0; row < 7; row++) {
        for (let col = 0; col < 7; col++) {
          if (startRow + row < cells && startCol + col < cells) {
            qrMatrix[startRow + row][startCol + col] = marker[row][col] === 1;
          }
        }
      }
    };
    
    // Add position markers in three corners
    addPositionMarker(0, 0); // Top-left
    addPositionMarker(0, cells - 7); // Top-right
    addPositionMarker(cells - 7, 0); // Bottom-left
    
    // Add timing patterns (alternating black and white modules)
    for (let i = 8; i < cells - 8; i++) {
      qrMatrix[6][i] = i % 2 === 0;
      qrMatrix[i][6] = i % 2 === 0;
    }
    
    // Add alignment pattern (smaller square near center)
    const alignmentCenter = Math.floor(cells / 2);
    const alignmentPattern = [
      [1,1,1,1,1],
      [1,0,0,0,1],
      [1,0,1,0,1],
      [1,0,0,0,1],
      [1,1,1,1,1]
    ];
    
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const r = alignmentCenter - 2 + row;
        const c = alignmentCenter - 2 + col;
        if (r >= 0 && r < cells && c >= 0 && c < cells) {
          qrMatrix[r][c] = alignmentPattern[row][col] === 1;
        }
      }
    }
    
    // Convert data to binary and fill remaining areas
    let binaryData = '';
    for (let i = 0; i < qrData.length; i++) {
      binaryData += qrData.charCodeAt(i).toString(2).padStart(8, '0');
    }
    
    // Fill data modules in a zigzag pattern
    let dataIndex = 0;
    let direction = -1; // Start moving up
    
    for (let col = cells - 1; col > 0; col -= 2) {
      if (col === 6) col--; // Skip timing pattern column
      
      for (let row = direction === -1 ? cells - 1 : 0; 
           direction === -1 ? row >= 0 : row < cells; 
           row += direction) {
        
        // Fill two columns at a time
        for (let c = 0; c < 2; c++) {
          const currentCol = col - c;
          if (currentCol >= 0 && currentCol < cells && 
              !qrMatrix[row][currentCol] && 
              !(row < 9 && currentCol < 9) && // Skip position marker areas
              !(row < 9 && currentCol >= cells - 8) &&
              !(row >= cells - 8 && currentCol < 9)) {
            
            if (dataIndex < binaryData.length) {
              qrMatrix[row][currentCol] = binaryData[dataIndex] === '1';
              dataIndex++;
            } else {
              // Fill remaining with random pattern
              qrMatrix[row][currentCol] = Math.random() > 0.5;
            }
          }
        }
      }
      
      direction *= -1; // Reverse direction
    }
    
    return { qrMatrix, size, cellSize, cells };
  };

  const handleScan = () => {
    setShowScanner(true);
    setIsScanning(true);
    setScanResult(null);
    
    // Simulate scanning process
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate
      setIsScanning(false);
      setScanResult(success);
      
      setTimeout(() => {
        if (success) {
          onScanSuccess();
        } else {
          onScanFailed();
        }
        setShowScanner(false);
        setScanResult(null);
      }, 2000);
    }, 3000);
  };

  const { qrMatrix, size, cellSize, cells } = generateQRCode();

  return (
    <div style={{padding:16}}>
      <div style={{marginBottom:16,textAlign:"center"}}>
        <h3 style={{margin:"0 0 8px",color:"#333",fontSize:14,fontWeight:700}}>
          📱 QR Code Attendance Scanner
        </h3>
        <p style={{margin:0,color:"#666",fontSize:11}}>
          Generate QR code for students to scan and mark attendance
        </p>
      </div>

      {/* QR Code Display */}
      <div style={{
        display:"flex",
        justifyContent:"center",
        marginBottom:16
      }}>
        <div style={{
          background:"white",
          border:"2px solid #e0e0e0",
          borderRadius:8,
          padding:20,
          boxShadow:"0 2px 8px rgba(0,0,0,0.1)"
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cells}, ${cellSize}px)`,
            gap: '0px',
            background: '#fff',
            padding: '8px',
            borderRadius: '4px',
            border: '2px solid #000'
          }}>
            {qrMatrix.map((row, rowIndex) =>
              row.map((isBlack, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    background: isBlack ? '#000' : '#fff'
                  }}
                />
              ))
            )}
          </div>
          
          {/* QR Code Info */}
          <div style={{marginTop:12,textAlign:"center"}}>
            <div style={{fontSize:10,color:"#666",marginBottom:2}}>
              Course: {courseCode}
            </div>
            <div style={{fontSize:10,color:"#666",marginBottom:2}}>
              Date: {date}
            </div>
            <div style={{fontSize:10,color:"#666"}}>
              Session: {sessionLabel || "Lecture"}
            </div>
          </div>
        </div>
      </div>

      {/* Scan Button */}
      <div style={{textAlign:"center"}}>
        <button
          onClick={handleScan}
          disabled={isScanning}
          style={{
            background: isScanning ? "#ccc" : C.blue,
            color: "white",
            border: "none",
            borderRadius:6,
            padding: "10px 20px",
            fontSize:12,
            fontWeight:600,
            cursor: isScanning ? "not-allowed" : "pointer"
          }}
        >
          {isScanning ? "🔄 Scanning..." : "📱 Simulate Scan"}
        </button>
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white",
            borderRadius:12,
            padding:24,
            maxWidth:350,
            width: "90%",
            textAlign: "center"
          }}>
            <h3 style={{margin:"0 0 16px",color:"#333",fontSize:16,fontWeight:700}}>
              {isScanning ? "📱 Scanning QR Code..." : "Scan Result"}
            </h3>
            
            {isScanning ? (
              <div>
                <div style={{
                  width: 60,
                  height: 60,
                  border: "3px solid " + C.blue,
                  borderTop: "3px solid transparent",
                  borderRadius: "50%",
                  margin: "0 auto 16px",
                  animation: "spin 1s linear infinite"
                }} />
                <p style={{color:"#666",fontSize:13}}>
                  Please scan the QR code...
                </p>
              </div>
            ) : (
              <div>
                {scanResult ? (
                  <div>
                    <div style={{
                      width: 50,
                      height: 50,
                      background: C.green,
                      borderRadius: "50%",
                      margin: "0 auto 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize:20,
                      color:"white",
                      fontWeight:700
                    }}>
                      ✓
                    </div>
                    <p style={{color:C.green,fontSize:14,fontWeight:600,marginBottom:6}}>
                      Scan Successful!
                    </p>
                    <p style={{color:"#666",fontSize:12}}>
                      Attendance marked successfully
                    </p>
                  </div>
                ) : (
                  <div>
                    <div style={{
                      width: 50,
                      height: 50,
                      background: C.red,
                      borderRadius: "50%",
                      margin: "0 auto 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize:20,
                      color:"white",
                      fontWeight:700
                    }}>
                      ✗
                    </div>
                    <p style={{color:C.red,fontSize:14,fontWeight:600,marginBottom:6}}>
                      Scan Failed!
                    </p>
                    <p style={{color:"#666",fontSize:12}}>
                      Please try again
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add CSS animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
