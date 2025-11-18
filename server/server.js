const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const habitRoutes = require("./routes/habit");

dotenv.config();
console.log("✅ MONGO_URI =", process.env.MONGO_URI);

console.log("✅ All ENV keys loaded:", Object.keys(process.env));
// console.log("✅ MONGO_URI value:", process.env.MONGO_URI);
const app = express();

connectDB(); // Connect to MongoDB

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/habits", require("./routes/habit"));


app.get("/", (req, res) => res.send("HabitHero API running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
