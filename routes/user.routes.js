const express = require("express");
const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");
const userRoutes = express.Router();

userRoutes.get("/register",(req,res)=>{
    res.render("register");
})

userRoutes.get("/login",(req,res)=>{
    res.render("login");
})

userRoutes.post("/registerData",async(req,res)=>{
    try{
        console.log(req.body);
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({msg:"All Feilds are Required !"});
        }

        const hashedPass = await bcrypt.hash(password,3)

        const user = new userModel({name,email,password:hashedPass});
        await user.save();
        console.log(user)
        return res.status(200).json({msg:"Register Successfully..."})
    }
    catch(err){
        return res.status(500).json({msg:"Internal server error",err});
    }
})

userRoutes.post("/loginData",async(req,res)=>{
    try{
        const {email,password} = req.body;

        if(!email || !password){
            return res.status(400).json({msg:"Both feilds are required !"});
        }

        const checkuser = await userModel.findOne({email});
        if(!checkuser){
            return res.status(400).json({msg:"Wrong credentials"});
        }
        const checkpass = await bcrypt.compare(password,checkuser.password);
        if(checkpass){
            let token = jwt.sign({course:"node"},"node");
            console.log(token,"token");
            return res.status(200).json({msg:"Login successfully",token});
        }
        else{
            return res.status(400).json({msg:"Wrong credential"});
        }
    }
    catch(err){
        return res.status(500).json({msg:"Internal server error",err});
    }
})

module.exports = userRoutes;