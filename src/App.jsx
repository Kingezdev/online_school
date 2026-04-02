import { useState } from "react";
import { useW } from './hooks/useW.js';
import { TopBar } from './components/TopBar.jsx';
import { SideNav } from './components/SideNav.jsx';
import { BottomNav } from './components/BottomNav.jsx';
import { TabNav } from './components/TabNav.jsx';
import { HomePage } from './components/HomePage.jsx';
import { StudentLogin } from './components/StudentLogin.jsx';
import { LecturerLogin } from './components/LecturerLogin.jsx';
import { AdminLogin } from './components/AdminLogin.jsx';
import { StudentDashboard } from './pages/StudentDashboard.jsx';
import { LecturerDashboard } from './pages/LecturerDashboard.jsx';
import { AdminDashboard } from './pages/AdminDashboard.jsx';
import { HomePage as MainHomePage } from './pages/HomePage.jsx';
import { MyCoursesPage } from './pages/MyCoursesPage.jsx';
import { AttendancePage } from './pages/AttendancePage.jsx';
import { StudentCoursesPage } from './pages/StudentCoursesPage.jsx';
import { StudentSubmissionsPage } from './pages/StudentSubmissionsPage.jsx';
import { StudentGradeBookPage } from './pages/StudentGradeBookPage.jsx';
import { StudentForumPage } from './pages/StudentForumPage.jsx';
import { StudentAssignmentsPage } from './pages/StudentAssignmentsPage.jsx';
import { StudentStudioPage } from './pages/StudentStudioPage.jsx';
import { StudentExtrasPage } from './pages/StudentExtrasPage.jsx';
import { LecturerGradeBookPage } from './pages/LecturerGradeBookPage.jsx';
import { LecturerAssignmentsPage } from './pages/LecturerAssignmentsPage.jsx';
import { LecturerForumPage } from './pages/LecturerForumPage.jsx';
import { LecturerReportsPage } from './pages/LecturerReportsPage.jsx';
import { LecturerExtrasPage } from './pages/LecturerExtrasPage.jsx';
import { AdminUsersPage } from './pages/AdminUsersPage.jsx';
import { AdminCoursesPage } from './pages/AdminCoursesPage.jsx';
import { AdminSystemPage } from './pages/AdminSystemPage.jsx';
import { AdminReportsPage } from './pages/AdminReportsPage.jsx';
import { AdminSettingsPage } from './pages/AdminSettingsPage.jsx';
import { C } from './data/constants.js';

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [loggedIn,setLoggedIn] = useState(false);
  const [role,setRole]         = useState("student");
  const [page,setPage]         = useState("dashboard");
  const [loginStep,setLoginStep] = useState("home"); // "home", "login"
  const w = useW();
  const isLg = w>=1024;
  const isMd = w>=640 && w<1024;
  const isSm = w<640;

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setLoginStep("login");
  };

  const handleLogin = () => {
    setLoggedIn(true);
    setPage("dashboard");
  };

  const handleBackToHome = () => {
    setLoginStep("home");
  };

  const switchRole = () => {
    setLoggedIn(false);
    setLoginStep("home");
  };

  if (!loggedIn) {
    if (loginStep === "home") {
      return <HomePage onRoleSelect={handleRoleSelect} />;
    } else if (loginStep === "login") {
      if (role === "student") {
        return <StudentLogin onLogin={handleLogin} onBack={handleBackToHome} />;
      } else if (role === "lecturer") {
        return <LecturerLogin onLogin={handleLogin} onBack={handleBackToHome} />;
      } else if (role === "admin") {
        return <AdminLogin onLogin={handleLogin} onBack={handleBackToHome} />;
      }
    }
  }

  const renderPage = () => {
    console.log("Current page:", page, "Role:", role);
    if (page==="dashboard") return role==="lecturer"?<LecturerDashboard setPage={setPage}/>:role==="admin"?<AdminDashboard setPage={setPage}/>:<StudentDashboard setPage={setPage}/>;
    if (page==="home")       return <HomePage setPage={setPage} role={role}/>;
    if (page==="my courses") return <MyCoursesPage role={role}/>;
    if (page==="attendance") return <AttendancePage role={role}/>;
    
    // Student pages
    if (role==="student") {
      if (page==="course") return <StudentCoursesPage setPage={setPage}/>;
      if (page==="sub") return <StudentSubmissionsPage setPage={setPage}/>;
      if (page==="grade book") return <StudentGradeBookPage setPage={setPage}/>;
      if (page==="forum") return <StudentForumPage setPage={setPage}/>;
      if (page==="assignment") return <StudentAssignmentsPage setPage={setPage}/>;
      if (page==="studio") return <StudentStudioPage setPage={setPage}/>;
      if (page==="extras") return <StudentExtrasPage setPage={setPage}/>;
    }
    
    // Lecturer pages
    if (role==="lecturer") {
      if (page==="grade book") return <LecturerGradeBookPage setPage={setPage}/>;
      if (page==="assignments") return <LecturerAssignmentsPage setPage={setPage}/>;
      if (page==="forum") return <LecturerForumPage setPage={setPage}/>;
      if (page==="reports") return <LecturerReportsPage setPage={setPage}/>;
      if (page==="extras") return <LecturerExtrasPage setPage={setPage}/>;
    }
    
    // Admin pages
    if (role==="admin") {
      if (page==="users") return <AdminUsersPage setPage={setPage}/>;
      if (page==="courses") return <AdminCoursesPage setPage={setPage}/>;
      if (page==="system") return <AdminSystemPage setPage={setPage}/>;
      if (page==="reports") return <AdminReportsPage setPage={setPage}/>;
      if (page==="settings") return <AdminSettingsPage setPage={setPage}/>;
    }
    
    return (
      <div style={{padding:isLg?48:32,textAlign:"center",color:"#888"}}>
        <div style={{fontSize:48,marginBottom:14}}>🚧</div>
        <div style={{fontSize:isLg?18:15,fontWeight:700}}>{page.charAt(0).toUpperCase()+page.slice(1)}</div>
        <div style={{fontSize:13,marginTop:6,color:"#aaa"}}>This section is coming soon</div>
      </div>
    );
  };

  return (
    <div style={{minHeight: "100vh", background: "#f5f7fa", fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column"}}>
      <TopBar role={role} setRole={switchRole} setPage={setPage} currentPage={page}/>

      <div style={{display: "flex", flex: 1, overflow: "hidden"}}>
        {/* Main area */}
        <div style={{flex: 1, display: "flex", flexDirection: "column", overflow: "hidden"}}>
          {/* Scrollable content */}
          <div style={{flex: 1, overflowY: "auto", paddingBottom: isSm ? "70px" : "0"}}>
            {renderPage()}
          </div>
        </div>
      </div>

      {/* Bottom nav — mobile only */}
      {isSm && <BottomNav page={page} setPage={setPage} role={role}/>}
    </div>
  );
}