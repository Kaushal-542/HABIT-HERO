import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ← Add this

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        // .then((res) => setUser(res.data.user))
        .then((res) => {
          const user = res.data.user;
          // ✅ Compare with existing user if already set (during hot reloads)
          if (
            !user?.badges?.includes("Welcome Hero") &&
            user.badges?.includes("Welcome Hero")
          ) {
            toast.success("🎉 Welcome Hero badge unlocked!");
          }

          setUser({
            id: user._id,
            name: user.name,
            xp: user.xp,
            streak: user.streak,
            badges: user.badges || [], // ✅ handle undefined
          });
        })

        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false)); // important
    } else {
      setLoading(false);
    }
  }, []);

//   useEffect(() => {
//   const token = localStorage.getItem("token");

//   if (token && !user) {
//     axios
//       .get("/api/auth/me", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((res) => {
//         setUser(res.data.user);
//       })
//       .catch(() => {
//         localStorage.removeItem("token");
//       })
//       .finally(() => {
//         setLoading(false); // ← Mark loading complete
//       });
//   } else {
//     setLoading(false); // ← Even if no token, stop loading
//   }
// }, []);

//   useEffect(() => {
//   const token = localStorage.getItem("token");
//   if (token && !user) {
//     axios
//       .get("/api/auth/me", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((res) => {
//         setUser(res.data.user); // your backend should send user data here
//       })
//       .catch(() => {
//         localStorage.removeItem("token");
//       });
//   }
// }, []);

  const login = async (email, password) => {
    const res = await axios.post("/api/auth/login", { email, password });
    const { token, user } = res.data;
    // setUser(user);
    setUser({
      id: user._id,
      name: user.name,
      xp: user.xp,
      streak: user.streak,
      badges: user.badges || [], // ✅ safe fallback
    });
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, setUser }}>
      {children}
    </AuthContext.Provider>   
  );
};

// Custom hook to use the auth context
// export const useAuth = () => useContext(AuthContext);
export const useAuth = () => useContext(AuthContext);

