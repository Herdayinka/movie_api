const express = require("express");

const {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
} = require("../controller/movieController");

const router = express.Router();

router.post("/createMovie", createMovie);
router.get("/", getMovies);
router.get("/:id", getMovieById);

module.exports = router;
