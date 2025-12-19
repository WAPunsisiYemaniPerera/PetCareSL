const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

// when user clicks the sign in with Google button user redirects here
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// then Google redirects back here
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Google login is successful, now create our JWT
        const payload = {
            id: req.user.id,
            name: req.user.name
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        // redirect the user to frontend with token
        res.redirect(`http://localhost:3000/login-success?token=${token}`);
    }
);

module.exports = router;
