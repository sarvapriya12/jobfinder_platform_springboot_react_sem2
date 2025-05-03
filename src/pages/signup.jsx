import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Signup.css"; // Ensure this file is correctly placed

const Signup = () => {
  const [userType, setUserType] = useState("APPLICANT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:8080/api/users/signup", {
        name,
        email,
        password,
        role: userType,
      });

      alert("Signup successful! Redirecting to login...");
      navigate("/login");
    } catch (error) {
      setError("Signup failed. Email might already be registered.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className={`toggle-buttons ${userType.toLowerCase()}`}>
        <button
          className={`toggle-button ${userType === "APPLICANT" ? "active" : ""}`}
          onClick={() => setUserType("APPLICANT")}
          type="button"
        >
          APPLICANT
        </button>
        <button
          className={`toggle-button ${userType === "RECRUITER" ? "active" : ""}`}
          onClick={() => setUserType("RECRUITER")}
          type="button"
        >
          RECRUITER
        </button>
      </div>

      <div className="signup-form">
        <div className="signup-type-box">{userType} SIGNUP</div>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="signup-input"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            className="signup-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            className="signup-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? "Signing Up..." : "Signup"}
          </button>
        </form>

        <p className="already-registered">
          Already registered? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
  