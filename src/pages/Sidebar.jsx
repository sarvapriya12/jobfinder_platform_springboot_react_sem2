import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css"; // Import the sidebar styles
import { User, LogOut } from "lucide-react"; // Import necessary icons

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    // Get current user from localStorage
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, []);

  // Helper function to check if a path is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <div className={`custom-sidebar ${user?.role?.toLowerCase() || ''}`}>
      <div className="logo">
        <h1>WorkLink</h1>
      </div>

      <input type="text" placeholder="Search..." className="sidebar-search" />

      <Link to="/" className={`sidebar-link ${isActive('/') && !isActive('/profile') ? 'active' : ''}`}>
        <i className="icon-home"></i>
        <span>Home</span>
      </Link>

      <Link to="/messages" className={`sidebar-link ${isActive('/messages') ? 'active' : ''}`}>
        <i className="icon-message"></i>
        <span>Messages</span>
      </Link>

      <Link to="/notifications" className={`sidebar-link ${isActive('/notifications') ? 'active' : ''}`}>
        <i className="icon-bell"></i>
        <span>Notifications</span>
      </Link>

      <Link to="/profile-page" className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}>
        <i className="icon-user"></i>
        <span>Profile</span>
      </Link>

      {/* Sidebar Options Based on Role */}
      {user?.role === "RECRUITER" ? (
        <div className="sidebar-dropdown">
          <button className="sidebar-dropbtn">
            <i className="icon-plus-circle"></i>
            <span>Create</span> <span className="dropdown-arrow">▼</span>
          </button>
          <div className="sidebar-dropdown-content">
            <Link to="/create-post">Create Post</Link>
            <Link to="/recruiter-dashboard">Create Job</Link>
          </div>
        </div>
      ) : (
        <Link to="/find-jobs" className={`sidebar-link ${isActive('/find-jobs') ? 'active' : ''}`}>
          <i className="icon-search"></i>
          <span>Find Jobs</span>
        </Link>
      )}

      {/* User Profile Section at Bottom with Logout */}
      {user && (
        <div className="sidebar-footer">
          <div className="user-info" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <img
              src={user.profileImage || "/api/placeholder/40/40"}
              alt={user.name || "User"}
              className="user-avatar"
            />
            <span className="user-name">{user.name || "User"}</span>
          </div>
          
          {isProfileOpen && (
            <>
              <div className="profile-dropdown">
              <Link to="/profile-page" className={`sidebar-link ${isActive('/profile') ? 'active' : ''}`}>
                  <User size={16} /> Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="dropdown-item logout"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
              <div className="dropdown-backdrop" onClick={() => setIsProfileOpen(false)}></div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;