// models/Habit.js
const mongoose = require("mongoose");

// const habitSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   name: { type: String, required: true },
//   completedDates: [{ type: Date }]  // Track which days habit was completed
// });
const habitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  completedDates: {
    type: [Date],
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});


module.exports = 
  mongoose.model("Habit", habitSchema)
  // habitSchema,
  // Habit: mongoose.model("Habit", habitSchema)
;
