import logo from './logo.svg';
import './App.css';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";  
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Register from "./pages/Register"; // import it
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/Dashboard"; // ✅ NEW  
import "bootstrap/dist/js/bootstrap.bundle.min.js";



const App = () => {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />

      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* ✅ Add Register route */}
          {/* <Route path="/" element={<h2>🏠 Home Page – HabitHero</h2>} /> */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                {/* <Home /> */}
                <Dashboard></Dashboard>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
