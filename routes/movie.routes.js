const express = require("express");
const movie = require("../model/movie.model");
const multer = require("multer");
const path = require("path");
movie_Model = express.Router();

movie_Model.use("/uploads",express.static(path.join(__dirname,"../uploads")));

movie_Model.get("/form",(req,res)=>{
    res.render("form");
});

const fileupload = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});


const uploadFields = multer({ storage: fileupload }).fields([
    { name: "poster_img", maxCount: 1 }, // Should match the input name in the form
    { name: "bg_img", maxCount: 1 }, // Should match the input name in the form
]);

movie_Model.post("/addData",uploadFields,async(req,res)=>{
    try {
        console.log(req.body);
        console.log(req.files);

        const poster_img = req.files.poster_img[0].path;
        const bg_img = req.files.bg_img[0].path;

        if (!req.files.poster_img || !req.files.bg_img) {
            return res.status(400).json({ error: "Both poster_img and background_img files are required." });
        }

        const { title,rate,cinema,language,length,type,certificate,date,description} = req.body;
     
       
        if(!title || !rate || !cinema || !language || !length || !type || !certificate || !date || !description || !poster_img || !bg_img){
            return res.json(400).json({msg:"All feilds are required !"});
        }

        const user = new movie ({title,rate,cinema,language,length,type,certificate,date,description,poster_img,bg_img});
        await user.save();
        console.log(user);
        // res.redirect("home");
        // res.json({ "movie": user })
        // return res.redirect("back");
        // return res.status(200).json({msg:"Movie added Successfully..."})

    } catch (error) {
        return res.status(500).json({msg:"server error",error:error.message})
    }
})

movie_Model.get("/about/:id",async(req,res)=>{
    let id = req.params.id;
    console.log(id);
   try{
        let movie_about = await movie.findById(id);
        console.log(movie_about);

        if(movie_about){
            res.render("about",{
                movies: movie_about
            });
        }else{
            res.status(404).send("Movie not found");
        }
   }
   catch(err){
        console.error("Error fetching movie details:", err);
        res.status(500).send("Internal Server Error");
   }
});


// movie_Model.get("/about:id",async(req,res)=>{
//     const id = req.params.id;
//     console.log(id);

//     const movie = await movie.findById(id);

//     if(!movie){
//         return res.status(404).json({msg:"Movie not found !"});
//     }
//     return res.json(movie);
// })


module.exports = movie_Model;