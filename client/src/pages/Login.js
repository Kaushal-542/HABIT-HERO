import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";      
import { toast } from "react-toastify";
import "../styles/form.css";





const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");    
  const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "dark"
); 

  useEffect(() => {
    // document.body.className = darkMode ? "dark-theme" : "light-theme";
    // localStorage.setItem("theme", darkMode ? "dark" : "light");
    if (darkMode) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    // const newTheme = document.body.classList.contains("dark-theme") ? "light-theme" : "dark-theme";
    // document.body.classList.remove("dark-theme", "light-theme");
    // document.body.classList.add(newTheme);
    // localStorage.setItem("theme", newTheme);
    setDarkMode((prev) => !prev);
  };

  const validateForm = () => {
    const { email, password } = form;

    if (!email || !password) {
      return "Please fill in both email and password.";
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      // setError(validationError);
      toast.error(validationError); // 🔥 toast for validation errors

      return;
    }
    console.log("🔐 Sending login data:", form); // ✅ Add this
    try {
      await login(form.email, form.password);
      toast.success("🎉 Login successful!");


      navigate("/");
    } catch (err) {
      console.error("❌ Login error:", err);
      if (err.response && err.response.data && err.response.data.msg) {
      // setError(err.response.data.msg); // Use backend error
      toast.error(err.response.data.msg);


    } else {
      // setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");

    }
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-navbar d-flex justify-content-between align-items-center px-4 py-3">
        <h2 className="app-name m-0">HabitHero</h2>
        <div className="d-flex align-items-center gap-2">
          {/* <button
            className="btn btn-sm btn-outline-secondary theme-toggle-btn"
            onClick={(toggleTheme) => setDarkMode(!darkMode)}
          >
            {darkMode ? "🌙 Dark" : "☀️ Light"}
          </button> */}
          <button className="btn btn-outline-light theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
            {/* 🌓 */}
            {darkMode ? '🌞' : '🌙'}
          </button>
         
        </div>
        {/* <button className="btn btn-outline-light logout-btn" onClick={handleLogout}>
          Logout
        </button> */}
      </div>

      <div className="container">
        <div className="form-container mx-auto col-md-6 bg-light">
          <h2 className="mb-4 text-center">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>
          <p className="mt-3 text-center">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>

  );
};

export default Login;
