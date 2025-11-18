require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { default: mongoose } = require("mongoose");

const movieRoutes = require("./routes/movieRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Connect to DB

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(error);
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
