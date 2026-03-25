import { useState } from "react";
import { useW } from './hooks/useW.js';
import { TopBar } from './components/TopBar.jsx';
import { SideNav } from './components/SideNav.jsx';
import { BottomNav } from './components/BottomNav.jsx';
import { TabNav } from './components/TabNav.jsx';
import { LoginPage } from './components/LoginPage.jsx';
import { StudentDashboard } from './pages/StudentDashboard.jsx';
import { LecturerDashboard } from './pages/LecturerDashboard.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { MyCoursesPage } from './pages/MyCoursesPage.jsx';
import { AttendancePage } from './pages/AttendancePage.jsx';
import { C } from './data/constants.js';

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn,setLoggedIn] = useState(false);
  const [role,setRole]         = useState("student");
  const [page,setPage]         = useState("dashboard");
  const w = useW();
  const isLg = w>=1024;
  const isMd = w>=640 && w<1024;
  const isSm = w<640;

  const handleLogin  = r => { setRole(r); setLoggedIn(true); setPage("dashboard"); };
  const switchRole   = r => { setRole(r); setPage("dashboard"); };

  if (!loggedIn) return <LoginPage onLogin={handleLogin}/>;

  const renderPage = () => {
    if (page==="dashboard") return role==="lecturer"?<LecturerDashboard setPage={setPage}/>:<StudentDashboard/>;
    if (page==="home")       return <HomePage setPage={setPage} role={role}/>;
    if (page==="my courses") return <MyCoursesPage role={role}/>;
    if (page==="attendance") return <AttendancePage/>;
    return (
      <div style={{padding:isLg?48:32,textAlign:"center",color:"#888"}}>
        <div style={{fontSize:48,marginBottom:14}}>🚧</div>
        <div style={{fontSize:isLg?18:15,fontWeight:700}}>{page.charAt(0).toUpperCase()+page.slice(1)}</div>
        <div style={{fontSize:13,marginTop:6,color:"#aaa"}}>This section is coming soon</div>
      </div>
    );
  };

  return (
    <div style={{minHeight:"100vh",background:"#f5f7fa",fontFamily:"Arial,sans-serif",display:"flex",flexDirection:"column"}}>
      <TopBar role={role} setRole={switchRole}/>

      <div style={{display:"flex",flex:1,overflow:"hidden"}}>
        {/* Sidebar — desktop only */}
        {isLg&&<SideNav page={page} setPage={setPage} role={role}/>}

        {/* Main area */}
        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
          {/* Tab nav — tablet */}
          {isMd&&<TabNav page={page} setPage={setPage} role={role}/>}

          {/* Scrollable content */}
          <div style={{flex:1,overflowY:"auto",paddingBottom:isSm?70:0}}>
            {renderPage()}
          </div>
        </div>
      </div>

      {/* Bottom nav — mobile only */}
      {isSm&&<BottomNav page={page} setPage={setPage} role={role}/>}
    </div>
  );
}