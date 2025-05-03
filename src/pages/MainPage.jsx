import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MainLayout.css';
import Sidebar from "./Sidebar";

const MainLayout = () => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user data
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be retrieved from authentication context or local storage
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
          setUser(userData);
          await Promise.all([
            fetchPosts(userData.id),
            fetchSuggestions(userData.id)
          ]);
        } else {
          navigate('/login');
          return;
        }
      } catch (error) {
        console.error('Error loading main page data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const fetchPosts = async (userId) => {
    try {
      // In a real app, this would be an actual API call to get posts from people the user follows
      const response = await fetch(`/api/posts/feed/${userId}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Using dummy data for demonstration
      setPosts([
        {
          id: '1',
          userId: '101',
          username: 'jane_doe',
          profileImage: '/api/placeholder/40/40',
          content: 'Enjoying the weekend!',
          mediaUrl: '/api/placeholder/400/300',
          mediaType: 'image',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          userId: '102',
          username: 'john_smith',
          profileImage: '/api/placeholder/40/40',
          content: 'Check out my new project',
          mediaUrl: '/api/placeholder/400/300',
          mediaType: 'image',
          createdAt: new Date().toISOString()
        }
      ]);
    }
  };

  const fetchSuggestions = async (userId) => {
    try {
      // In a real app, this would be an actual API call to get user suggestions
      const response = await fetch(`/api/users/suggestions/${userId}`);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      // Using dummy data for demonstration
      setSuggestions([
        { id: '201', name: 'Alex Johnson', profileImage: '/api/placeholder/40/40' },
        { id: '202', name: 'Sam Williams', profileImage: '/api/placeholder/40/40' },
        { id: '203', name: 'Taylor Brown', profileImage: '/api/placeholder/40/40' }
      ]);
    }
  };

  const handleFollow = async (userId) => {
    try {
      // In a real app, this would be an actual API call to follow a user
      await fetch('/api/follows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          followerId: user.id,
          followingId: userId
        }),
      });

      // Update suggestions list to reflect the new follow
      setSuggestions(suggestions.filter(suggestion => suggestion.id !== userId));
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="main-layout">
        <Sidebar />
        <div className="content-area">
          <div className="loading-container">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-layout">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="content-area">
        {/* Feed Section */}
        <div className="feed-section">
          <h2 style={{ color: "#18191a" }}>Your Feed</h2>

          {posts.length > 0 ? (
            posts.map(post => (
              <div className="post" key={post.id}>
                <div className="post-header">
                  <Link to={`/profile/${post.userId}`}>
                    <img
                      src={post.profileImage || '/api/placeholder/40/40'}
                      alt={post.username}
                      className="profile-picture-small"
                    />
                  </Link>
                  <Link to={`/profile/${post.userId}`} className="username">
                    {post.username}
                  </Link>
                </div>
                <div className="post-content">
                  {post.mediaType === 'image' && (
                    <img src={post.mediaUrl} alt="Post content" className="post-media" />
                  )}
                  {post.mediaType === 'video' && (
                    <video src={post.mediaUrl} controls className="post-media"></video>
                  )}
                  <p>{post.content}</p>
                </div>
                <div className="post-actions">
                  <button className="action-button">
                    <i className="icon-heart"></i> Like
                  </button>
                  <button className="action-button">
                    <i className="icon-comment"></i> Comment
                  </button>
                  <button className="action-button">
                    <i className="icon-share"></i> Share
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-feed">
              <p>Your feed is empty. Follow some users to see their posts here!</p>
            </div>
          )}
        </div>

        {/* Profile and Suggestions Section */}
        <div className="profile-section">
          <div className="suggestions">
            <h3 className="section-title">Suggestions For You</h3>
            {suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <div className="suggestion-item" key={suggestion.id}>
                  <Link to={`/profile/${suggestion.id}`} className="profile-link">
                    <img
                      src={suggestion.profileImage}
                      alt={suggestion.name}
                      className="profile-picture-small"
                    />
                  </Link>
                  <div className="suggestion-info">
                    <Link to={`/profile/${suggestion.id}`} className="username">
                      {suggestion.name}
                    </Link>
                    <span className="suggestion-type">New user</span>
                  </div>
                  <button
                    className="follow-button"
                    onClick={() => handleFollow(suggestion.id)}
                  >
                    Follow
                  </button>
                </div>
              ))
            ) : (
              <div className="no-suggestions">
                No suggestions available at the moment.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MainLayout;