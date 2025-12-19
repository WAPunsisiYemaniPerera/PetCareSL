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
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        //check if the user is there and if the password is correct
        if (user && (await bcrypt.compare(password, user.password))) {
            
            
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id, user.name, user.isAdmin),
            });

        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

//for admin login
router.post('/admin/login', async (req,res)=>{
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});

        //check if the user is there, is password correct and isadmin=true
        if(user && user.isAdmin && (await bcrypt.compare(password, user.password))){
            
            //if all are correct the give a token to the admin
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: generateToken(user._id, user.name, user.isAdmin),
            });
        }else{
            res.status(401).json({
                messsage: 'Invalid Credentials'
            })
        }
        
    } catch(error){
        res.status(500).json({
            message: 'Server Error'
        })
    }
})

module.exports = router;