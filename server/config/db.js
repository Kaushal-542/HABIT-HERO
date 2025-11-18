const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    console.log("📡 Connecting to MongoDB...");
    console.log("MONGO_URI is:", process.env.MONGO_URI);

    // const conn = await mongoose.connect(process.env.MONGO_URI);

    // const conn = await mongoose.connect(process.env.MONGO_URI || "ENV not loading");
    const conn = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });               
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
