const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs')
const generateToken = require ('../utils/generateToken');

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

//login with email and password
router.post('/login', async (req,res)=>{
    const {email, password} = req.body;

    try {
        //find the user from the email
        const user = await User.findOne({email});

        if(user){
            //check whether the hashed password in the db and the user entered password is ==
            const isMatch = await bcrypt.compare(password, user.password);

            if(isMatch){
                //if password is correct, then create a token for user
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    token: generateToken(user._id, user.name)
                });
            } else {
                res.status(401).json({ 
                    message: 'Invalid email or password' 
                });
            }
        } else {
            res.status(401).json({
                message: 'Invalid email or password'
            })
        }
    } catch (error){
        res.status(500).json({ message: 'Server Error' });
    }
}) 

module.exports = router;