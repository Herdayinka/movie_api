const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    director: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      default: "unknown",
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    release_year: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Movie", movieSchema);
