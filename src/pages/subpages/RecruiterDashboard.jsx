import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Plus,
  X,
  Settings,
  LogOut,
  Briefcase,
  Download,
  ChevronDown,
  Eye,
} from "lucide-react";
import { useAuth } from "../AuthContext";
import "./RecruiterDashboard.css";

const RecruiterDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [currentResumeUrl, setCurrentResumeUrl] = useState("");
  
  // Job posts state
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]); // Store all posts for searching
  const [filteredPosts, setFilteredPosts] = useState([]);
  
  // Applications state
  const [applications, setApplications] = useState([]);
  const [allApplications, setAllApplications] = useState([]); // Store all applications
  const [filteredApplications, setFilteredApplications] = useState([]);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  
  // New post state
  const [newPost, setNewPost] = useState({
    title: "",
    companyName: "",
    location: "",
    techStack: "",
    description: "",
  });

  // Fetch job posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/jobs/recruiter/${user.id}`
        );
        const data = await response.json();
        setAllPosts(data); // Store all posts
        setPosts(data);
        setFilteredPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [user]);

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      if (!user?.id) return; // Prevent API call if user is not loaded

      try {
        const response = await fetch(`http://localhost:8080/api/applications/recruiter/${user.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }
        const data = await response.json();
        console.log("Fetched applications:", data); // Debugging
        setAllApplications(data); // Store all applications
        setApplications(data);
        setFilteredApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [user]); // Refetch if user changes

  // Search functionality - filter both posts and applications
  useEffect(() => {
    if (searchQuery.trim() === "") {
      // If search is empty, show all
      setFilteredPosts(allPosts);
      setFilteredApplications(allApplications);
    } else {
      const query = searchQuery.toLowerCase();
      
      // Filter job posts
      const matchingPosts = allPosts.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.companyName.toLowerCase().includes(query) ||
        post.location.toLowerCase().includes(query) ||
        post.techStack.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query)
      );
      setFilteredPosts(matchingPosts);
      
      // Filter applications
      const matchingApplications = allApplications.filter(app => {
        const jobTitle = getJobTitle(app.jobId);
        return app.applicantName.toLowerCase().includes(query) ||
               app.applicantEmail.toLowerCase().includes(query) ||
               jobTitle.toLowerCase().includes(query);
      });
      setFilteredApplications(matchingApplications);
    }
  }, [searchQuery, allPosts, allApplications]);

  const getJobTitle = (jobId) => {
    const job = allPosts.find((post) => post.id === jobId);
    return job ? job.title : "Unknown Job";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitNewPost = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newPost,
          recruiterId: user.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const updatedPosts = [...allPosts, data];
        setAllPosts(updatedPosts);
        setPosts(updatedPosts);
        setFilteredPosts(updatedPosts);
        setNewPost({
          title: "",
          companyName: "",
          location: "",
          techStack: "",
          description: "",
        });
        setIsModalOpen(false);
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleViewResume = (resumeUrl) => {
    setCurrentResumeUrl(`http://localhost:8080/api/applications/view/${encodeURIComponent(resumeUrl)}`);
    setIsResumeModalOpen(true);
  };

  const handleCloseResumeModal = () => {
    setIsResumeModalOpen(false);
    setCurrentResumeUrl("");
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <button
            className="drawer-toggle"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            <Menu size={24} />
          </button>
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search jobs and applications..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Profile Section */}
        <div className="header-right">
          <div
            className="profile-section"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <img
              src="/profile-photo.jpg"
              alt="Profile"
              className="profile-photo"
            />
            <span className="profile-name">{user?.name || "Recruiter"}</span>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <Link to="/update-profile" className="dropdown-item">
                  <Settings size={16} /> Update Profile
                </Link>
                <button onClick={logout} className="dropdown-item logout">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Side Drawer */}
      <div className={`dashboard-drawer ${isDrawerOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <button
            className="drawer-close"
            onClick={() => setIsDrawerOpen(false)}
          >
            <X size={24} />
          </button>
          <h2>Recruiter Tools</h2>
        </div>
        <ul className="drawer-nav">
          <li>
            <span
              className="drawer-link new-post-link"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={20} /> New Post
            </span>
          </li>
          <li>
            <Link to="/manage-posts" className="drawer-link">
              <Briefcase size={20} /> Manage Posts
            </Link>
          </li>
        </ul>
      </div>

      {/* Job Post Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Job Post</h2>
              <button
                className="modal-close"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmitNewPost} className="job-post-form">
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={newPost.companyName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={newPost.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Tech Stack</label>
                <input
                  type="text"
                  name="techStack"
                  value={newPost.techStack}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={newPost.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Create Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resume Viewer Modal */}
      {isResumeModalOpen && (
        <div className="resume-modal-overlay">
          <div className="resume-modal-content">
            <div className="resume-modal-header">
              <h2>Resume Viewer</h2>
              <button
                className="resume-modal-close"
                onClick={handleCloseResumeModal}
              >
                <X size={24} />
              </button>
            </div>
            <div className="resume-iframe-container">
              <iframe
                src={currentResumeUrl}
                title="Resume Viewer"
                className="resume-iframe"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        {/* Left Section - Job Listings as Cards */}
        <div className="left-content">
          <h2>{searchQuery ? "Search Results" : "Your Job Postings"}</h2>
          <div className="job-cards-container">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <div className="job-card" key={post.id}>
                  <h3>{post.title}</h3>
                  <p className="company-name">{post.companyName}</p>
                  <p className="job-location">{post.location}</p>
                  <p className="tech-stack">
                    <strong>Tech Stack:</strong> {post.techStack}
                  </p>
                </div>
              ))
            ) : (
              <p>No job posts found{searchQuery ? " matching your search" : ""}.</p>
            )}
          </div>
        </div>

        {/* Right Section - Applications List */}
        <div className="applications-dropdown">
          <button
            className="dropdown-toggle"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Job Applications ({filteredApplications.length}) <ChevronDown size={18} />
          </button>
          {isDropdownOpen && (
            <div className="applications-wrapper" style={{ maxHeight: "calc(100vh - 180px)", overflowY: "auto" }}>
              <ul className="applications-list" style={{ maxHeight: "none" }}>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((app) => (
                    <li key={app.id} className="application-item">
                      <span title={`${getJobTitle(app.jobId)} - ${app.applicantName} (${app.applicantEmail})`}>
                        <strong>{getJobTitle(app.jobId)}</strong> - {app.applicantName} ({app.applicantEmail})
                      </span>
                      <div className="resume-actions">
                        <button className="view-resume-btn" onClick={() => handleViewResume(app.resumeUrl)}>
                          <Eye size={16} /> View
                        </button>
                        <a className="download-resume" href={`http://localhost:8080/api/applications/resume/${encodeURIComponent(app.resumeUrl)}`} download>
                          <Download size={16} /> Download
                        </a>
                      </div>
                    </li>
                  ))
                ) : (
                  <p>No applications found{searchQuery ? " matching your search" : ""}.</p>
                )}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RecruiterDashboard;