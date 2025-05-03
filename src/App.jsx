import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Signup from "./pages/signup";
import Login from "./pages/login";
import ProfilePage from "./pages/profilePage";
import MainLayout from "./pages/MainPage";
import ApplicantDashboard from "./pages/subpages/ApplicantDashboard";
import RecruiterDashboard from "./pages/subpages/RecruiterDashboard";
import { AuthProvider, useAuth } from "./pages/AuthContext";

// Protected Route component
const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "APPLICANT") {
      return <Navigate to="/applicant-dashboard" replace />;
    } else if (user.role === "RECRUITER") {
      return <Navigate to="/recruiter-dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

const AppWithAuth = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Protected applicant routes */}
        <Route element={<ProtectedRoute allowedRoles={["APPLICANT"]} />}>
          <Route path="/find-jobs" element={<ApplicantDashboard />} />
          <Route path="/browse-jobs" element={<div>Browse Jobs Page</div>} />
          <Route path="/applications" element={<div>Applications Page</div>} />
          <Route path="/profile" element={<div>Profile</div>} />

        </Route>

        {/* Protected recruiter routes */}
        <Route element={<ProtectedRoute allowedRoles={["RECRUITER"]} />}>
          <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
          <Route path="/create-post" element={<div>Create Job Post Page</div>} />
          <Route path="/manage-posts" element={<div>Manage Posts Page</div>} />
        </Route>

        {/* Shared protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile-page" element={<ProfilePage />} />
          <Route path="/main-page" element={<MainLayout />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
};

function App() {
  return (
    <Router>
      <AppWithAuth />
    </Router>
  );
}

export default App;
