import React, { useState } from 'react';
import './App.css';
import LoginPage    from './pages/LoginPage';
import Dashboard    from './pages/Dashboard';
import UploadPage   from './pages/UploadPage';
import ScanPage     from './pages/ScanPage';
import ResultPage   from './pages/ResultPage';
import HistoryPage  from './pages/HistoryPage';

export default function App() {
  const [page,    setPage]    = useState('login');
  const [file,    setFile]    = useState(null);
  const [menuOpen,setMenuOpen]= useState(false);
  
  // Nayi State: Backend se aaye analysis result ko store karne ke liye
  const [analysisData, setAnalysisData] = useState(null);
  const [userType, setUserType] = useState(null); 

  // Updated goScan: Yeh function ab file aur backend ka result dono accept karega
  const goScan = (selectedFile, resultFromServer) => {
    setFile(selectedFile);
    setAnalysisData(resultFromServer); // Backend result ko save karein
    setPage('scan'); // Analysis animation dikhane ke liye scan page par jayein
  };
function App() {
  const [role, setRole] = useState(null); // null, guest, user

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      setRole("user");
    }
  }, []);

  if (!role) {
    return <LoginPage onLogin={setRole} />;
  }

  return <Dashboard />;
}
  // Login logic
  if (page === 'login') {
  return (
    <LoginPage 
      onLogin={(type) => {
        setUserType(type);   // user ya guest
        setPage('dashboard');
      }} 
    />
  );
}

  return (
    <div className="layout">
      {/* ── Sidebar ── */}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">AI Evidence</span>
        </div>

        <nav>
          {[
            { id: 'dashboard', icon: '📊', label: 'Dashboard'  },
            { id: 'upload',    icon: '📤', label: 'Upload'      },
            { id: 'history',   icon: '📁', label: 'History'     },
            
          ].map(item => (
            <button
              key={item.id}
              className={`nav-btn ${page === item.id ? 'active' : ''}`}
              onClick={() => { 
                setPage(item.id); 
                setMenuOpen(false);
                if (item.id !== 'result') setAnalysisData(null); // Data clear karein agar naya menu chuna jaye
              }}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="avatar">YG</div>
            <div>
              <div className="user-name">
              {userType === 'guest' ? 'Guest User' : localStorage.getItem("currentUser")}
              </div>
              <div className="user-role">
              {userType === 'guest' ? 'Demo Mode' : 'Registered User'}
              </div>
            </div>
          </div>
          <button 
  className="logout-btn" 
  onClick={() => {
    setUserType(null);
    setPage('login');
  }}
>
  Logout →
</button>
        </div>
      </aside>

      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}

      <main className="main">
        {/* Topbar */}
        <div className="topbar">
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
          <span className="page-title">
            {{ dashboard:'Dashboard', upload:'Upload Evidence', scan:'Scanning...', result:'Report', history:'History' }[page]}
          </span>
          <span className="status-indicator">● Online</span>
        </div>

        {/* Page content: Backend data pass karne ke liye props update kiye gaye hain */}
        <div className="content">
          {page === 'dashboard' && <Dashboard setPage={setPage} userType={userType} />}
          
          {page === 'upload'    && <UploadPage goScan={goScan} />}
          
          {page === 'scan'      && (
            <ScanPage 
              setPage={setPage} 
              file={file} 
            />
          )}
          
          {page === 'result'    && (
            <ResultPage 
              setPage={setPage} 
              file={file} 
              resultData={analysisData} // Backend se aaya asli data ResultPage ko bhejien
            />
          )}
          
          {page === 'history'   && <HistoryPage setPage={setPage} />}
        </div>
      </main>
    </div>
  );
}