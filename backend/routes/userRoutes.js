const express = require('express');
const router = express.Router();
const User = require('../models/User');

// register new user
router.post('/register', async (req,res)=>{
    const {name,email,password} = req.body;

    try{
        //check if there is already a member with this email
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        //create new user
        const user = await User.create({
            name,
            email,
            password,
        });

        if(user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                message: 'User registered successfully!'
            });
        }else {
            res.status(400).json({
                message: 'Invalid user data'
            })
        }
    } catch (error){
        res.status(500).json({
            message: 'Server Error'
        })
    }
});

module.exports = router;