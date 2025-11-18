const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/user");
const authenticateUser = require("../middleware/authMiddleware"); // adjust path as needed        

// GET /api/auth/me
router.get("/me", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    // 2. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // 3. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Save new user
    const user = new User({
      name,
      email,
      password: hashedPassword
      // badges: ["Welcome Hero"], // 🎖️ Assign default badge
    });

    await user.save();

    // 5. Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });


    // 🎖️ Give welcome badge if first login
    if (!user.badges) user.badges = [];

    if (!user.badges.includes("👋 Welcome Hero")) {
      user.badges.push("👋 Welcome Hero");
      await user.save(); // Save updated user with badge
    }

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        xp: user.xp, // ✅ include this
        streak: user.streak,
        badges: user.badges, // ✅ include badges here too
      
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Please fill in all fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        streak: user.streak, // ✅ Include streak (make sure it's in the schema)
        badges: user.badges, // ✅ include badges in response
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ msg: "Server error" });
  }
});




module.exports = router;
