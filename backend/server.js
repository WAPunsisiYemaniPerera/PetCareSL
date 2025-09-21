const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
const { protect } = require('./middleware/authMiddleware');
const { admin } = require('./middleware/adminMiddleware');


dotenv.config();
require('./config/passport')(passport);

connectDB();

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Express Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/chat', require('./routes/chatRoute')); 
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/pets', require('./routes/petRoutes'));
app.use('/auth', require('./routes/authRoutes')); 
app.use('/api/admin', protect, admin, require('./routes/adminRoutes'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Manager's server is running on http://localhost:${PORT}`);
});