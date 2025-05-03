import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './ProfilePage.css';
import Sidebar from './Sidebar';
import UploadPhoto from './UploadPhoto';

const ProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');
  const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
  const [currentUser, setCurrentUser] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadPhoto, setShowUploadPhoto] = useState(false);

  useEffect(() => {
    // Get current logged in user
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
        setCurrentUser(loggedInUser);

        // Determine if viewing own profile
        const profileId = userId || loggedInUser.id;
        setIsOwnProfile(profileId === loggedInUser.id);

        await Promise.all([
          fetchProfileData(profileId),
          fetchUserPosts(profileId),
          fetchUserPhotos(profileId),
          fetchUserJobs(profileId),
          fetchFollowStats(profileId)
        ]);

        if (loggedInUser.id && profileId !== loggedInUser.id) {
          await checkFollowStatus(loggedInUser.id, profileId);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const fetchProfileData = async (profileId) => {
    try {
      // Make an API call to fetch profile data
      const response = await axios.get(`http://localhost:8080/api/users/${profileId}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Using dummy data for demonstration
      setProfile({
        id: profileId,
        name: 'Demo User',
        email: 'user@example.com',
        profileImage: '/api/placeholder/100/100',
        bio: 'This is a demo profile bio.',
        role: 'APPLICANT'
      });
    }
  };

  const fetchUserPosts = async (profileId) => {
    try {
      // Make an API call to fetch user posts
      const response = await axios.get(`http://localhost:8080/api/posts/user/${profileId}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Using dummy data for demonstration
      setPosts([
        {
          id: '1',
          mediaUrl: '/api/placeholder/300/300',
          mediaType: 'image',
          caption: 'Beautiful day!',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          mediaUrl: '/api/placeholder/300/300',
          mediaType: 'image',
          caption: 'Coding session',
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          mediaUrl: '/api/placeholder/300/300',
          mediaType: 'image',
          caption: 'New project',
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  const fetchUserPhotos = async (profileId) => {
    try {
      // Fetch user photos from the photos API
      const response = await axios.get(`http://localhost:8080/api/photos/user/${profileId}`);
      setPhotos(response.data);
    } catch (error) {
      console.error('Error fetching photos:', error);
      // Fallback to empty array if fetch fails
      setPhotos([]);
    }
  };

  const fetchUserJobs = async (profileId) => {
    try {
      // Make an API call to fetch user jobs
      const response = await axios.get(`http://localhost:8080/api/jobs`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Using dummy data for demonstration
      setJobs([
        {
          id: '1',
          title: 'Software Engineer',
          company: 'Tech Company',
          location: 'Remote',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'UX Designer',
          company: 'Design Studio',
          location: 'New York',
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  const fetchFollowStats = async (profileId) => {
    try {
      // Make API calls to fetch follower and following counts
      const followersResponse = await axios.get(`http://localhost:8080/api/follows/${profileId}/followers`);
      const followingResponse = await axios.get(`http://localhost:8080/api/follows/${profileId}/following`);

      setFollowStats({
        followers: followersResponse.data.length,
        following: followingResponse.data.length
      });
    } catch (error) {
      console.error('Error fetching follow stats:', error);
      // Using dummy data for demonstration
      setFollowStats({
        followers: Math.floor(Math.random() * 1000),
        following: Math.floor(Math.random() * 500)
      });
    }
  };

  const checkFollowStatus = async (followerId, followingId) => {
    try {
      // Make an API call to check if current user follows profile user
      const response = await axios.get(`http://localhost:8080/api/follows/check/${followerId}/${followingId}`);
      setIsFollowing(response.data.exists);
    } catch (error) {
      console.error('Error checking follow status:', error);
      // Setting random follow status for demonstration
      setIsFollowing(Math.random() > 0.5);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        // Unfollow
        await axios.delete(`http://localhost:8080/api/follows/${currentUser.id}/${profile.id}`);
        setIsFollowing(false);
        setFollowStats({
          ...followStats,
          followers: followStats.followers - 1
        });
      } else {
        // Follow
        await axios.post('http://localhost:8080/api/follows', {
          followerId: currentUser.id,
          followingId: profile.id
        });
        setIsFollowing(true);
        setFollowStats({
          ...followStats,
          followers: followStats.followers + 1
        });
      }
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
  };

  const toggleUploadPhoto = () => {
    setShowUploadPhoto(!showUploadPhoto);
  };

  const handlePhotoUploadSuccess = (newPhoto) => {
    // Add the new photo to the photos array
    setPhotos([...photos, newPhoto]);
    // Close the upload modal
    setShowUploadPhoto(false);
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <Sidebar />
        <div className="profile-content">
          <div className="loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <Sidebar />
        <div className="profile-content">
          <div className="error-message">Profile not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Left Sidebar */}
      <Sidebar />
      
      {/* Upload Photo Component - Conditionally rendered */}
      {showUploadPhoto && isOwnProfile && (
        <div className="upload-photo-overlay">
          <UploadPhoto
            userId={currentUser.id}
            onUploadSuccess={handlePhotoUploadSuccess}
            onClose={() => setShowUploadPhoto(false)}
          />
        </div>
      )}
      
      {/* Main Content Area */}
      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-image-container">
            <img
              src={profile.profileImage || '/api/placeholder/150/150'}
              alt={profile.name}
              className="profile-image"
            />
          </div>

          <div className="profile-info">
            <div className="profile-name-section">
              <h1 className="profile-name">{profile.name}</h1>
              {!isOwnProfile && (
                <button
                  className={`follow-button ${isFollowing ? 'following' : ''}`}
                  onClick={handleFollow}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
              {isOwnProfile && (
                <div className="profile-actions">
                  <Link to="/edit-profile" className="edit-profile-button">
                    Edit Profile
                  </Link>
                  <button className="upload-photo-button" onClick={toggleUploadPhoto}>
                    Upload Photo
                  </button>
                </div>
              )}
            </div>

            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{posts.length}</span> posts
              </div>
              <div className="stat">
                <span className="stat-value">{photos.length}</span> photos
              </div>
              <Link to={`/followers/${profile.id}`} className="stat">
                <span className="stat-value">{followStats.followers}</span> followers
              </Link>
              <Link to={`/following/${profile.id}`} className="stat">
                <span className="stat-value">{followStats.following}</span> following
              </Link>
            </div>

            <div className="profile-bio">
              {profile.bio || 'No bio yet.'}
            </div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="profile-tabs">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
              onClick={() => setActiveTab('posts')}
            >
              <i className="icon-grid"></i> Posts
            </button>
            
            <button
              className={`tab-button ${activeTab === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveTab('jobs')}
            >
              <i className="icon-briefcase"></i> Jobs
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'posts' && (
              <div className="photos-grid">
              {photos.length > 0 ? (
                photos.map(photo => (
                  <div className="photo-thumbnail" key={photo.id}>
                    <img src={photo.imageUrl} alt={photo.title} />
                    <div className="photo-title">{photo.title}</div>
                  </div>
                ))
              ) : (
                <div className="no-content">
                  No photos yet.
                  {isOwnProfile && (
                    <button className="upload-first-photo" onClick={toggleUploadPhoto}>
                      Upload your first photo
                    </button>
                  )}
                </div>
              )}
            </div>
            )}

            

            {activeTab === 'jobs' && (
              <div className="jobs-list">
                {jobs.length > 0 ? (
                  jobs.map(job => (
                    <div className="job-card" key={job.id}>
                      <h3 className="job-title">{job.title}</h3>
                      <div className="job-company">{job.company}</div>
                      <div className="job-location">{job.location}</div>
                      <div className="job-date">
                        Posted: {new Date(job.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-content">No jobs posted yet.</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;