require("dotenv").config();
require("express-async-errors");

const express = require("express");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

const movieRoutes = require("./routes/movieRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Serve frontend static files
app.use(express.static(path.join(__dirname, "frontend")));

// Connect to DB
const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;

if (!mongoUri) {
  console.error(
    "Error: MONGO_URI is not set. Create a .env file with MONGO_URI=<your-mongodb-connection-string>"
  );
  console.error("Example: MONGO_URI=mongodb://127.0.0.1:27017/moviedb");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message || err);
    process.exit(1);
  });

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/movies", movieRoutes);

// Global Error Handler
app.use(errorHandler);

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
