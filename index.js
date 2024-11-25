const express = require("express");
const ejs = require("ejs");
const path = require('path');
const connection = require("./connect/db");
const movie_route = require("./routes/movie.routes")
const movie = require("./model/movie.model");
const port = 8100;
const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/movie", movie_route);

app.get("/", async (req, res) => {
    let allMovies = await movie.find();
    console.log(allMovies);
    res.render("home", {
        movies: allMovies
    });
})

app.get("/form", (req, res) => {
    res.render("form");
})



app.listen(port, async (err) => {
    await connection;
    (err) ? console.log("something went wrong...", err) : console.log("server is runnig at port ", port);
})