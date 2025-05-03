import React, { useState, useEffect } from "react";
import { Menu, Search, Settings, LogOut, User, X, Briefcase, Bookmark, Upload } from "lucide-react";
import { useAuth } from "../AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./ApplicantDashboard.css";

const ApplicantDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]); // Store all jobs for searching
  const [approvedJobs, setApprovedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [recruiters, setRecruiters] = useState({});

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/jobs");
        let data = await response.json();

        console.log("Fetched Jobs:", data); // Debugging

        setAllJobs(data); // Store all jobs
        setJobs(data.slice(-6)); // Show only the last 6 jobs from the database
        setFilteredJobs(data.slice(-6));

        // Extract unique recruiter IDs
        const recruiterIds = [...new Set(data.map(job => job.recruiterId))];
        fetchRecruitersInfo(recruiterIds);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  // Fetch recruiter information
  const fetchRecruitersInfo = async (recruiterIds) => {
    try {
      // Simulate fetching recruiter information - replace with actual API call
      // In a real implementation, you would have an API endpoint to fetch user details by ID
      const mockRecruiters = {};

      // Here you would make API calls to get recruiter info
      // Example: const response = await fetch(`http://localhost:8080/api/users?ids=${recruiterIds.join(',')}`);
      // const recruitersData = await response.json();

      // For now, we'll use placeholder data
      recruiterIds.forEach(id => {
        mockRecruiters[id] = {
          name: `Recruiter ${id.substring(0, 4)}`,
          email: `recruiter_${id.substring(0, 4)}@example.com`
        };
      });

      setRecruiters(mockRecruiters);
    } catch (error) {
      console.error("Error fetching recruiters info:", error);
    }
  };

  useEffect(() => {
    // Filter jobs when search query changes
    if (searchQuery.trim() === "") {
      setFilteredJobs(jobs); // Show only the latest 6 when no search
    } else {
      // Search from all jobs when there's a query
      const filtered = allJobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  }, [searchQuery, jobs, allJobs]);

  useEffect(() => {
    const fetchApprovedJobs = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/applications/applicant/${user.id}`);
        const data = await response.json();
        setApprovedJobs(data.filter(app => app.status === "ACCEPTED"));
      } catch (error) {
        console.error("Error fetching approved jobs:", error);
      }
    };

    fetchApprovedJobs();
  }, [user]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resume) {
      alert("Please upload your resume before applying.");
      return;
    }

    if (!selectedJob.recruiterId) {
      console.error("Error: recruiterId is missing in selectedJob", selectedJob);
      alert("Unable to apply. Recruiter information is missing.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("jobId", selectedJob.id);
    formData.append("recruiterId", selectedJob.recruiterId); // Ensure recruiterId is passed
    formData.append("applicantId", user.id);
    formData.append("applicantName", user.name || "Applicant Name");
    formData.append("applicantEmail", user.email || "applicant@example.com");
    formData.append("resume ", resume);
    formData.append("coverLetter", coverLetter || "");

    try {
      const response = await fetch("http://localhost:8080/api/applications/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Application submitted successfully!");
        setSelectedJob(null);
        setCoverLetter("");
        setResume(null);
      } else {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        alert("Error submitting application. Please try again.\nTry decreasing the file size");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  // Get recruiter info for a job
  const getRecruiterInfo = (recruiterId) => {
    if (recruiters[recruiterId]) {
      return recruiters[recruiterId];
    }
    return { name: "Unknown Recruiter", email: "unknown@example.com" };
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-left">
          <button className="drawer-toggle" onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
            <Menu size={24} />
          </button>
          <div className="search-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="header-right">
          <div className="profile-section" onClick={() => setIsProfileOpen(!isProfileOpen)}>
            <img
              src="/profile-photo.jpg"
              alt="Profile"
              className="profile-photo"
            />
            <span className="profile-name">{user?.name || "Applicant"}</span>
          </div>

          {isProfileOpen && (
            <>
              <div className="profile-dropdown">
                <Link to={`/update-profile/${user.id}`} className="dropdown-item">
                  <User size={16} /> Update Profile
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
      </header>

      <div className={`dashboard-drawer ${isDrawerOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <button className="drawer-close" onClick={() => setIsDrawerOpen(false)}>
            <X size={24} />
          </button>
          <h2>Applicant Tools</h2>
        </div>
        <ul className="drawer-nav">
          <li>
            <Link to="/my-applications" className="drawer-link">
              <Briefcase size={20} /> My Applications
            </Link>
          </li>
          <li>
            <Link to="/saved-jobs" className="drawer-link">
              <Bookmark size={20} /> Saved Jobs
            </Link>
          </li>
        </ul>
      </div>


      {isDrawerOpen && <div className="drawer-backdrop" onClick={() => setIsDrawerOpen(false)}></div>}

      <main className="dashboard-main">
        <div className="left-content">
          <h2>{searchQuery ? "Search Results" : "Latest Job Postings"}</h2>
          <div className="job-cards-container">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => {
                const recruiter = getRecruiterInfo(job.recruiterId);
                return (
                  <div className="job-card" key={job.id}>
                    <h3>{job.title}</h3>
                    <p className="company-name">{job.companyName}</p>
                    <p className="job-location">{job.location}</p>
                    <p className="job-recruiter">Posted by: {recruiter.name}</p>
                    <p className="job-recruiter-email">Contact: {recruiter.email}</p>
                    <button className="apply-button" onClick={() => setSelectedJob(job)}>
                      Apply Now
                    </button>
                  </div>
                );
              })
            ) : (
              <p>No job postings found.</p>
            )}
          </div>
        </div>

        <div className="right-content">
          <h2>Approved Jobs</h2>
          <select className="approved-jobs-dropdown">
            <option value="">Select a job</option>
            {approvedJobs.map((job) => (
              <option key={job.id} value={job.id}>{job.title}</option>
            ))}
          </select>
        </div>
      </main>

      {selectedJob && (
        <div className="overlay">
          <div className="modal grey-bg">
            <h2>Apply for {selectedJob.title}</h2>
            <p><strong>Company:</strong> {selectedJob.companyName}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Description:</strong> {selectedJob.description}</p>

            {/* Display recruiter info */}
            <p><strong>Posted by:</strong> {getRecruiterInfo(selectedJob.recruiterId).name}</p>
            <p><strong>Contact:</strong> {getRecruiterInfo(selectedJob.recruiterId).email}</p>

            <form onSubmit={handleApply}>
              <label>Upload Resume:</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files[0])}
                required
              />

              <label>Cover Letter (Optional):</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows="4"
                placeholder="Tell us why you're a good fit for this position"
              ></textarea>

              <div className="modal-footer">
                <button
                  type="submit"
                  className="submit-application"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : <><Upload size={16} /> Submit</>}
                </button>
                <button
                  type="button"
                  className="close-modal"
                  onClick={() => setSelectedJob(null)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicantDashboard;