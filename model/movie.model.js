const mongoose = require("mongoose");
const movie = new mongoose.Schema({
    title: String,
    rate: String,
    cinema: [String],
    language: [String],
    length: String,
    type: [String],
    certificate: String,
    date: String,
    description: String,
    poster_img: String,
    bg_img: String
})
const movieSchema = mongoose.model("movie", movie);
module.exports = movieSchema;
