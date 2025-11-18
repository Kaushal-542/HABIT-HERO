import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";    
import { toast } from "react-toastify";
import "../styles/form.css";



const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
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
    const { name, email, password } = form;

    if (!name || !email || !password) {
      toast.error("Please fill all fields."); // 🔥 toast for empty fields
      return "Please fill all fields.";
    }

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email.";
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    // 🔐 Optional: Check for stronger passwords
    const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
    if (!strongPasswordRegex.test(password)) {
      toast.error("Password must include at least one uppercase letter, one number, and one symbol.");
      return "Weak password.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();

    if (validationError) {
      // setError(validationError);
      toast.error(validationError); // 🔥 validation error

      return;
    }
    console.log("📦 Sending register data:", form); // ✅ Add this here
    try {
      const res = await axios.post("/api/auth/register", form);
      console.log("✅ Registration successful:", res.data);
      toast.success("🎉 Registered successfully! Please login.");


      navigate("/login");
    } catch (err) {
      console.error("❌ Error registering:", err.response?.data?.msg || err.message);
      if (err.response && err.response.data && err.response.data.msg) {
        // setError(err.response.data.msg);
        toast.error(err.response.data.msg);

        } else {
        // setError("Something went wrong during registration.");
        toast.error("Something went wrong during registration.");


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
          <h2 className="mb-4 text-center">Register</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
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
            <button type="submit" className="btn btn-success w-100">
              Register
            </button>
          </form>
          <p className="mt-3 text-center">
              Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

//     <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem" }}>
//       <h2>Register</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Name"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//         />
//         <br />
//         <input
//           type="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />
//         <br />
//         <input
//           type="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />
//         <br />
//         <button type="submit">Register</button>
//       </form>
//     </div>
//   );
// };

export default Register;
