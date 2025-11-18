const Movie = require("../model/movieModel");

exports.createMovie = async (req, res) => {
  const movie = await Movie.create(req.body);
  res.status(201).json(movie);
};

exports.getMovies = async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
};
