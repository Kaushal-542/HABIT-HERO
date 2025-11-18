import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // built-in styles
import Modal from "react-bootstrap/Modal";
// import { allBadges } from "../constants/badges";

const Dashboard = () => {
  const { user, loading, logout, setUser  } = useAuth();
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState("");
  const [adding, setAdding] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedHabitDates, setSelectedHabitDates] = useState([]);
  const [selectedHabitName, setSelectedHabitName] = useState("");
  const [filter, setFilter] = useState("all"); // New filter state
  const [togglingId, setTogglingId] = useState(null);
  const allBadges = [
  "🔟 10 XP",
  "🏅 50 XP",
  "🎖️ 100 XP",
  "🌠 XP Master",
  "⭐ Legend",
  "🥉 Starter",
  "🏃 Consistency Champ",
  "🔥 1-Week Streak",
  "🔥🔥 2-Week Streak",
  "🥷 1-Month Streak",
  "👑 Streak Master",
  "🌅 Early Bird",
  "🌙 Night Owl"
];
const [darkMode, setDarkMode] = useState(
  localStorage.getItem("theme") === "dark"
);
const [showMenu, setShowMenu] = useState(false);


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
// const [earnedBadges, setEarnedBadges] = useState([]);
// const [ setNewBadge] = useState(null);

useEffect(() => {
  if (user?.badges) {
    // setEarnedBadges(user.badges);

    const storedBadges = JSON.parse(localStorage.getItem("earnedBadges")) || [];
    const newOnes = user.badges.filter((badge) => !storedBadges.includes(badge));

    if (newOnes.length > 0) {
      // setNewBadge(newOnes[0]);
      toast.success(`🎉 You earned a new badge: ${newOnes[0]}!`);
      localStorage.setItem("earnedBadges", JSON.stringify(user.badges));
    }
  }
}, [user]);

// const unachievedBadges = allBadges.filter((badge) => !earnedBadges.includes(badge));
                                            
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/habits", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHabits(res.data);
      } catch (err) {
        console.error("Failed to fetch habits", err);
      }
    };

    if (user) {
      fetchHabits();
    }
  }, [user]);

  // const { user, loading, logout, setUser } = useAuth(); // add setUser here

const toggleHabit = async (habitId) => {
  if (togglingId) return; // prevent multiple clicks
  setTogglingId(habitId);

  const today = new Date().toISOString().split("T")[0];

  // Optimistically update habit state
  setHabits((prevHabits) =>
    prevHabits.map((habit) =>
      habit._id === habitId
        ? {
            ...habit,
            completedDates: habit.completedDates.some(
              (date) => date.split("T")[0] === today
            )
              ? habit.completedDates.filter(
                  (date) => date.split("T")[0] !== today
                )
              : [...habit.completedDates, today],
          }
        : habit
    )
  );

  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(`/api/habits/${habitId}/toggle`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { updatedHabits, updatedUser, newBadges } = res.data;

    // ✅ Set updated habits
    setHabits(updatedHabits);

    // ✅ Also update XP in user context (optional but important)
    setUser((prevUser) => ({
      ...prevUser,
      xp: updatedUser.xp,
      streak: updatedUser.streak, // if using
      badges: updatedUser.badges, // ✅ Add this line!
    }));

    // ✅ Show new badge toasts (do NOT mutate state again)
    if (newBadges && newBadges.length > 0) {
      newBadges.forEach((badge) => {
        toast.success(`🎉 New Badge Unlocked: ${badge}!`, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      });
    }
    // // 🎉 Toast for new badges
    // if (newBadges && newBadges.length > 0) {
    //   newBadges.forEach((badge) => {
    //     toast.success(`🎉 New Badge Unlocked: ${badge}!`, {
    //       position: "top-right",
    //       autoClose: 3000,
    //       theme: "colored",
    //     });
    //   });

    //   // Update user context
    //   setUser((prevUser) => ({
    //     ...prevUser,
    //     badges: [...prevUser.badges, ...newBadges],
    //   }));
    // }
  } catch (err) {
    console.error("Toggle failed", err);
    toast.error("Something went wrong!");
  }finally {
    setTogglingId(null);
  }
  

};



  const updateHabit = async (habitId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      `/api/habits/${habitId}`,
      { name: editedName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const updated = res.data;
      setHabits((prev) =>
        prev.map((habit) => (habit._id === updated._id ? updated : habit))
      );
      toast.success("✅ Habit name updated!");
      setEditingHabitId(null);
      setEditedName("");
    } catch (err) {
      console.error("Error updating habit", err);
      toast.error("Failed to update habit");
    }
  };

  const deleteHabit = async (habitId) => {
    const confirm = window.confirm("Are you sure you want to delete this habit?");
    if (!confirm) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/habits/${habitId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHabits((prev) => prev.filter((h) => h._id !== habitId));
      toast.success("🗑️ Habit deleted");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete habit");
    }
  };

  if (loading) return <p>Loading...</p>;

  const handleLogout = () => {
    logout();
    toast.success("👋 Logged out successfully!");
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-navbar d-flex justify-content-between align-items-center px-4 py-3">  
        {/* <img
          src="LogoMain.ico" // Replace with your actual logo path
          alt="App Logo"
          className="app-logo"
          style={{ width: "32px", height: "32px" }}
        /> */}
        <h2 className="app-name m-0">HabitHero</h2>

        {/* Large screen: normal buttons */}
        <div className="d-none d-sm-flex align-items-center gap-2">
          <button className="btn btn-outline-light theme-toggle-btn" onClick={toggleTheme} title="Toggle Theme">
            {darkMode ? '🌞' : '🌙'}
          </button>
          <button className="btn btn-outline-light logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Small screen: hamburger */}
        <div className="d-flex d-sm-none position-relative">
          <button className="btn btn-outline-light" onClick={() => setShowMenu(!showMenu)}>
            ☰
          </button>

          {showMenu && (
            <div className="dropdown-menu show p-2" style={{ right: 0, top: '100%', position: 'absolute' }}>
              <button className="dropdown-item" onClick={toggleTheme}>
                {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
              </button>
              <button className="dropdown-item" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
        {/* <button className="btn btn-outline-light logout-btn" onClick={handleLogout}>
          Logout
        </button> */}
      </div>
      
      <div className="welcome-stars">

      </div>
      {/* <div className="main-dashboard welcome-stars px-4 px-md-5 "> */}
      <div  className="main-dashboard welcome-stars px-4 px-md-5 ">
        <div className="header-section d-flex flex-column flex-md-row justify-content-between align-items-center gap-4 mb-4">
          
          {/* Left: Welcome */}
          {/* <div className="welcome-text text-md-start text-center"> */}
          <div className="welcome-heading welcome-box p-3 rounded">
            <h1>Welcome, {user?.name} 👋</h1>
            <p>You have {habits.length} habits today. Keep it going!</p>
          </div>

          {/* Right: XP and Streak */}
          <div className="progress-box d-flex align-items-center position-relative  p-3 px-4">
    
            {/* XP Block */}
            <div className="xp-indicator text-center d-flex flex-column align-items-center">
              <div className="marker marker-a" id="marker-a">🧝🏼</div>
              <div className="xp-circle">{user?.xp ?? 0}</div>
              <div className="label">🌟 XP</div>
            </div>

            {/* SVG Line
            <svg
              className="connecting-line"
              viewBox="0 0 200 100"
              preserveAspectRatio="none"
            >
              <path
                d="M 24 80 C 100 10, 100 10, 176 80"
                stroke="#ccc"
                strokeWidth="2"
                strokeDasharray="4 4"
                fill="none"
              />
            </svg> */}

            {/* Streak Block */}
            <div className="streak-indicator text-center d-flex flex-column align-items-center">
              <div className="marker marker-b" id="marker-b">🧝🏻‍♂️</div>
              <div className="streak-circle">{user?.streak ?? 0} day</div>
              <div className="label">🔥 Streak</div>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <p className="quote text-center fst-italic">
          Keep up the momentum! Complete at least one habit daily.
        </p>
      </div>
      
      {/* Badges Section */}
      <div className="your-badges">
        {/* Achieved Badges */}
        {user?.badges && user.badges.length > 0 && (
          <div className="card badge-section mb-4">
            <div className="card-body">
              <h5 className="card-title text-center text-white">Your Badges 🏆</h5>
              {/* <div className="d-flex flex-wrap gap-3 mt-3 justify-content-center"> */}
              <div className="badge-scroll-wrapper">
                <div className="badge-scroll-container">
                  {user.badges.map((badge, idx) => (
                    <span
                      key={idx}
                      className="badge custom-badge fs-6 p-2 rounded-pill"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Unachieved Badges */}
        {user && (
          <div className="card badge-section mb-4 mt-2">
            <div className="card-body">
              <h5 className="card-title text-center text-secondary">Locked Badges 🔒</h5>
              {/* <div className="d-flex flex-wrap gap-3 mt-3 justify-content-center"> */}
              <div className="badge-scroll-wrapper">
                <div className="badge-scroll-container">
                  {allBadges
                    .filter((badge) => !user.badges.includes(badge))
                    .map((badge, idx) => (
                      <span
                        key={idx}
                        className="badge custom-badge locked-badge fs-6 p-2 rounded-pill"
                      //   style={{
                      //   filter: "grayscale(10%)",
                      //   backgroundColor: "#e0e0e0",
                      //   color: "gray",
                      // }}
                      >
                        {badge}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      


      {/* ✅ Add Habit Section */}
      <section className="add-habit-section mt-5">
        {/* <h3 className="mb-3 text-white">➕ Add a New Habit</h3> */}

        {/* <div className="habit-form-wrapper"> */}
            {/* <div className="d-flex justify-content-between align-items-center flex-wrap gap-3"> */}
            <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const trimmed = habitName.trim();

                  if (trimmed.length < 3) {
                    toast.warning("⚠️ Habit name is too short");
                    return;
                  }

                  const exists = habits.some(h => h.name.toLowerCase() === trimmed.toLowerCase());
                  if (exists) {
                    toast.warning("⚠️ This habit already exists");
                    return;
                  }

                  try {
                    setAdding(true);
                    const token = localStorage.getItem("token");
                    const res = await axios.post(
                      "/api/habits",
                      { name: trimmed },
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }
                    );

                    setHabits((prev) => [...prev, res.data]);
                    setHabitName("");
                    toast.success("✅ Habit added!");
                  } catch (err) {
                    console.error("Add habit failed", err);
                    toast.error("Failed to add habit");
                  } finally {
                    setAdding(false);
                  }
                }}
                // className="d-flex flex-column flex-md-row gap-3"
                className="d-flex align-items-center flex-wrap gap-3 habit-form-wrapper"
              >
                <h3 className="mb-0 text d-flex align-items-center gap-2">
                  <span className="emoji">➕</span> Add a New Habit
                </h3>

                <div className="d-flex flex-grow-1 gap-2">
                  <input
                    type="text"
                    className="form-control habit-input"
                    value={habitName}
                    onChange={(e) => setHabitName(e.target.value)}
                    placeholder="e.g., Drink water"
                  />
                  <button type="submit" className="btn btn-success add-btn " disabled={adding}>
                    {adding ? "Adding..." : "➕ Add"}
                  </button>
                </div>
                
              </form>

              {/* Filter Options */}
              {/* <div className="d-flex flex-wrap align-items-center ms-auto text-white"> */}
               <div className="d-flex align-items-center flex-wrap filter-dropdown mt-2 mt-md-0">
                <label className="me-2 fw-bold">Filter:</label>
                <select
                  className="form-select w-auto"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">📋 All</option>
                  <option value="completed">✅ Completed</option>
                  <option value="incomplete">❌ Incomplete</option>
                </select>
              </div>

        {/* </div> */}
        </div>
      </section>

      {/* Habit Cards */}
      <section className="habit-cards ">
        <h3 className="text mb-4">Your Habits</h3>
        <div className="row">
          {habits
            .filter((habit) => {
              const today = new Date().toISOString().split("T")[0];
              const isCompleted = habit.completedDates.some(
                (date) => new Date(date).toISOString().split("T")[0] === today
              );
              if (filter === "completed") return isCompleted;
              if (filter === "incomplete") return !isCompleted;
              return true;
            })
            .map((habit) => {
              const isCompleted = habit.completedDates.some(
                (date) => new Date(date).toISOString().split("T")[0] === new Date().toISOString().split("T")[0]
              );

              return (
                <div className="col-md-4 mb-4" key={habit._id}>
                  {/* <div className={`card habit-card ${isCompleted ? "bg-success text-white" : "bg-light"}`}> */}
                  <div className={`card habit-card ${isCompleted ? "completed" : ""}`}>
                      {editingHabitId === habit._id ? (
                        <>
                          <input
                            type="text"
                            className="form-control"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                          />
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-success" onClick={() => updateHabit(habit._id)}>✅ Save</button>
                            <button className="btn btn-sm btn-secondary" onClick={() => setEditingHabitId(null)}>❌ Cancel</button>
                          </div>
                        </>
                      ) : (
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold habit-name">{habit.name}</span>
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => toggleHabit(habit._id)}
                          />
                        </div>
                      )}
                      
                      {/* Action Buttons (hidden by default, appear on hover) */}
                      {/* <div className="habit-actions position-absolute top-1 start-50 translate-middle-x mt-2 d-flex gap-3"> */}
                      <div className="habit-actions position-absolute start-50 translate-middle-x d-flex gap-3">
                        <button
                          className="icon-btn"
                          onClick={() => {
                            setEditingHabitId(habit._id);
                            setEditedName(habit.name);
                          }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="icon-btn"
                          onClick={() => deleteHabit(habit._id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                        <button
                          className="icon-btn"
                          onClick={() => {
                            setSelectedHabitDates(habit.completedDates);
                            setSelectedHabitName(habit.name);
                            setShowCalendar(true);
                          }}
                          title="View Calendar"
                        >
                          📅
                        </button>
                      </div>

                      {/* Action Buttons
                      {!editingHabitId && (
                        <div className="d-flex gap-2 flex-wrap">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => {
                              setEditingHabitId(habit._id);
                              setEditedName(habit.name);
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => deleteHabit(habit._id)}
                          >
                            🗑️ Delete
                          </button>
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => {
                              setSelectedHabitDates(habit.completedDates);
                              setSelectedHabitName(habit.name);
                              setShowCalendar(true);
                            }}
                          >
                            📅 View
                          </button>
                        </div>
                      )} */}
                    </div>
                  </div>
                
              );
            })}
        </div>
      </section>

      {/* ✅ Calendar Modal - Paste this before final closing div */}
      <Modal show={showCalendar} onHide={() => setShowCalendar(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedHabitName} - Completed Days</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Calendar
            tileClassName={({ date }) => {
              const iso = date.toISOString().split("T")[0];
              const isCompleted = selectedHabitDates.some(d => {
                return new Date(d).toISOString().split("T")[0] === iso;
              });
              return isCompleted ? "completed-day" : null;
            }}
          />
        </Modal.Body>
      </Modal>


    </div>
    
  )
}    
export default Dashboard;
