const mongoose = require("mongoose");
const { HabitSchema } = require("./Habit"); // ✅ Add this line

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  xp: {
    type: Number,
    default: 0,
  },
  streak: { 
    type: Number, 
    default: 0 
  }, // Add this if not present
  lastCompletedDate: { 
    type: Date 
  }, // ✅ ADD THIS
  // habits: [habitSchema], // if you're storing embedded habits
  badges: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
