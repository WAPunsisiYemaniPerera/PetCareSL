const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    },
async (accessToken, refreshToken, Profiler,done)=>{
    //after coming the details of the user from the Google Run this
    const newUser = {
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value
    };

    try {
        // check whether there is a user based on the google Id from our database
        let user = await User.findOne({ googleId: profile.id});

        if(user){
            //if there , the details of the user will be given
            done(null, user);
        } else {
            //if there is no user then create a new user and give the details
            user = await User.create(newUser);
            done(null, user);
        }
    } catch (err) {
        console.error(err);
    }
}));

//the functions that want for the session
passport.serializeUser ((user,done) =>{
    done(null, user.id);
});

passport.deserializUser(async (id,done) =>{
    try{
        const user = await User.findById(id);
        done(null, user);
    } catch(err){
        done(err, null);
    }
})
}