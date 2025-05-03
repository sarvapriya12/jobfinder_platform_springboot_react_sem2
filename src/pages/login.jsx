import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css"; 
import { useAuth } from "./AuthContext"; 

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8080/api/users/login", {
        email,
        password,
      });
      // const response = await axios.post("http://192.168.1.19:5173/login", {
      //   email,
      //   password,
      // });
      const user = response.data;
      login(user);
      // if (user.role === "RECRUITER") {
      //   navigate("/recruiter-dashboard", { replace: true });
      // } else if (user.role === "APPLICANT") {
      //   navigate("/applicant-dashboard", { replace: true });
      // } else {
      //   setError("Unknown user role. Please contact support.");
      // }
      if (user.role === "RECRUITER") {
        navigate("/main-page", { replace: true });
      } else if (user.role === "APPLICANT") {
        navigate("/main-page", { replace: true });
      } else {
        setError("Unknown user role. Please contact support.");
      }
    } catch (error) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container-unique">
      <form className="login-form-unique" onSubmit={handleSubmit}>
        <h2>Login</h2>
        
        {error && <p className="error-message-unique">{error}</p>}

        <input
          type="email"
          className="login-input-unique"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="login-input-unique"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <div className="login-options-unique">
          <label className="remember-me-unique">
            <input type="checkbox" />
            Remember Me
          </label>
          <Link to="/forgot-password" className="forgot-password-unique">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className="login-button-unique" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="signup-link-unique">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
