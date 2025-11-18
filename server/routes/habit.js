// routes/habit.js
const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");
const authenticateUser = require("../middleware/authMiddleware");
const User = require("../models/user");


// GET all habits for a user
router.get("/", authenticateUser, async (req, res) => {
  const habits = await Habit.find({ user: req.user.id });
  res.json(habits);
});

// // POST new habit
// router.post("/", authenticateUser, async (req, res) => {
//   const habit = new Habit({
//     user: req.user.id,
//     name: req.body.name,
//     completedDates: [],
//   });
//   await habit.save();
//   res.status(201).json(habit);
// });

// POST /api/habits → Add a new habit
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ msg: "Habit name is required" });
    }

    const newHabit = new Habit({
      name,
      user: req.user.id,
      completedDates: [],
    });

    await newHabit.save();

    res.status(201).json(newHabit);
  } catch (err) {
    console.error("Error adding habit:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Correct Habit toggle route
router.put("/:id/toggle", authenticateUser, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
    if (!habit) return res.status(404).json({ msg: "Habit not found" });

    const today = new Date().toISOString().split("T")[0];

    const isCompleted = habit.completedDates.some(
      (date) => date.toISOString().split("T")[0] === today
    );

    const user = await User.findById(req.user.id);
    let newBadges = []; // ✅ FIXED: Declare it early

    if (isCompleted) {
      // Unmark today
      habit.completedDates = habit.completedDates.filter(
        (date) => date.toISOString().split("T")[0] !== today
      );
      // user.xp -= 10;
      user.xp = Math.max(0, user.xp - 10); // Ensure XP doesn't go below 0

    } else {
      // // Mark as completed
      // habit.completedDates.push(new Date());
      // user.xp += 10;

      // Mark habit as completed
      habit.completedDates.push(new Date());

      const lastDate = user.lastCompletedDate;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (
        lastDate &&
        new Date(lastDate).toDateString() === yesterday.toDateString()
      ) {
        user.streak += 1;
      } else if (
        !lastDate ||
        new Date(lastDate).toDateString() !== new Date().toDateString()
      ) {
        user.streak = 1;
      }

      user.lastCompletedDate = new Date(); // update with today
      user.xp += 10; // XP increment

    //   // 🎖️ Badge logic
    //   if (!user.badges) user.badges = [];

    //   if (user.xp >= 100 && !user.badges.includes("XP Master 100")) {
    //     user.badges.push("XP Master 100");
    //   }

    //   if (user.xp >= 500 && !user.badges.includes("XP Master 500")) {
    //     user.badges.push("XP Master 500");
    //   }

    //   if (user.streak >= 7 && !user.badges.includes("Streak Pro")) {
    //     user.badges.push("Streak Pro");
    //   }

    //   if (user.streak >= 30 && !user.badges.includes("Streak Legend")) {
    //     user.badges.push("Streak Legend");
    //   }
    // }
      // 🎖️ Badge logic
      if (!user.badges) user.badges = [];
      

      // const assignBadge = (badge) => {
      //   if (!user.badges.includes(badge)) user.badges.push(badge);
      // };
      const assignBadge = (badge) => {
        if (!user.badges.includes(badge)) {
          user.badges.push(badge);
          newBadges.push(badge); // ✅ Track new badge
        }
      };


      // // XP-based
      // if (user.xp >= 100) assignBadge("🌠 XP Master");
      // if (user.xp >= 500) assignBadge("⭐ Legend");

      // // Streak-based
      // if (user.streak >= 1) assignBadge("📅 Day 1 Conqueror");
      // if (user.streak >= 3) assignBadge("🔥 3-Day Streak");
      // if (user.streak >= 7) assignBadge("🔥🔥 7-Day Warrior");
      // if (user.streak >= 30) assignBadge("🥷 Habit Ninja");

      // ✅ XP-based Badges
      if (user.xp >= 10) assignBadge("🔟 10 XP");
      if (user.xp >= 50) assignBadge("🏅 50 XP");
      if (user.xp >= 100) assignBadge("🎖️ 100 XP");
      if (user.xp >= 250) assignBadge("🌠 XP Master");
      if (user.xp >= 500) assignBadge("⭐ Legend");

      // ✅ Streak-based Badges
      if (user.streak >= 1) assignBadge("🥉 Starter");
      if (user.streak >= 3) assignBadge("🏃 Consistency Champ");
      if (user.streak >= 7) assignBadge("🔥 1-Week Streak");
      if (user.streak >= 14) assignBadge("🔥🔥 2-Week Streak");
      if (user.streak >= 30) assignBadge("🥷 1-Month Streak");
      if (user.streak >= 50) assignBadge("👑 Streak Master");

      // ✅ Time-based habit completion (Optional bonus badges)
      const currentHour = new Date().getHours();
      if (currentHour < 8) assignBadge("🌅 Early Bird");
      if (currentHour >= 21) assignBadge("🌙 Night Owl");

      // First Habit Completion
      if (
        habit.completedDates.length === 1 && // first time marking
        !user.badges.includes("✅ First Habit Completed")
      ) {
        assignBadge("✅ First Habit Completed");
      }
    }

    await habit.save();
    await user.save();

    const allHabits = await Habit.find({ user: req.user.id });

    res.json({
      updatedHabits: allHabits,
      updatedUser: {
        id: user._id,
        name: user.name,
        xp: user.xp,
        streak: user.streak,
        badges: user.badges, // ✅ Add this here
      },
      newBadges,
    });
  } catch (err) {
    console.error("Error toggling habit:", err);
    res.status(500).json({ msg: "Server error" });
  }
});


// // TOGGLE habit for today
// router.put("/:id/toggle", authenticateUser, async (req, res) => {
//   const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });
//   if (!habit) return res.status(404).json({ msg: "Habit not found" });

//   const today = new Date().toISOString().split("T")[0];
//   const index = habit.completedDates.findIndex(
//     (date) => date.toISOString().split("T")[0] === today
//   );

//   if (index > -1) {
//     habit.completedDates.splice(index, 1); // uncheck
//   } else {
//     habit.completedDates.push(new Date()); // check
//   }

//   await habit.save();
//   res.json(habit);
// });
// PUT /api/habits/:id → Update habit name
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const habit = await Habit.findOne({ _id: req.params.id, user: req.user.id });

    if (!habit) {
      return res.status(404).json({ msg: "Habit not found" });
    }

    habit.name = req.body.name;
    await habit.save();

    res.json(habit);
  } catch (err) {
    console.error("Error updating habit:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE /api/habits/:id → Delete a habit
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!habit) {
      return res.status(404).json({ msg: "Habit not found" });
    }
    res.json({ msg: "Habit deleted", id: habit._id });
  } catch (err) {
    console.error("Error deleting habit:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
