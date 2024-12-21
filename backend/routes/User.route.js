
const express = require('express');
const UserModel = require('../models/User.model');
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt = require('jsonwebtoken');

router.post('/register',async (req,res)=>{
    try {
        const username = await UserModel.findOne({name: req.body.name});
        if(username){
            throw new Error("user Name already exists");
        }
        const userEmail = await UserModel.findOne({email: req.body.email});
        if(userEmail){
            throw new Error("user Email already exists");
        }else{
            const salt = await bcrypt.genSalt(10);
            const hashpassword = await bcrypt.hash(req.body.password,salt);
            req.body.password = hashpassword;

            const newuser = new UserModel(req.body);
            await newuser.save();
            res.send({
                success: true,
                message:'Registration successfully'
            })
        }
    } catch (error) {
        res.status(404).json({
            error: error.message
        })
    }
})


router.post('/login',async(req,res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});
        if(!user){
            throw new Error("Invalid email");
        }
        const validPassword = await bcrypt.compare(
            req.body.password,
            user.password,
        )
        if(!validPassword){
            throw new Error("Invalid password");
        }
        const token = jwt.sign({userId:user._id,email:user.email},process.env.TOKEN_SECRET);

        res.send({
            success: true,
            message: "user Login successfully",
            data:token
        })
    } catch (error) {
        res.send({
            success: false,
            message: error.message,
        })
    }
})

module.exports = router;