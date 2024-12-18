const express = require("express");
const ejs = require("ejs");
const path = require('path');
const mongoose = require("mongoose");
// const connection = require("./connect/db");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://tanviladva01:tanvi_123@cluster0.5doqt.mongodb.net/collection",
      { useNewUrlParser: true, useUnifiedTopology: true ,serverSelectionTimeoutMS:5000}
    );
    console.log("Mongoose is connected");
  } catch (err) {
    console.error("Connection error:", err);
  }
};

connectDB();


const movie_route = require("./routes/movie.routes")
const movie = require("./model/movie.model");
const user_route = require("./routes/user.routes");
const port = 8100;
const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/movie", movie_route);
app.use("/user",user_route);

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
    // await connection;
    (err) ? console.log("something went wrong...", err) : console.log("server is runnig at port ", port);
})