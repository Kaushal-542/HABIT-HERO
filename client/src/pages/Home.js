import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Home = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    

    const handleLogout = () => {
    logout();
    toast.info("👋 Logged out successfully");
    navigate("/login");
    };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Welcome to HabitHero 🦸‍♂️</h1>
      <p>You’re successfully logged in!</p>

      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
        Logout
      </button>
    </div>
  );
};

export default Home;
