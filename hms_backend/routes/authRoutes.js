// hms_backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// --- POST /api/auth/register (User Registration) ---
router.post('/register', async (req, res) => {
    const { username, password, role } = req.body;
    try {
        // 1. Check if user already exists
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username already exists.' });
        }
        
        // 2. Create new user instance. Password hashing happens in the User Model (models/User.js).
        user = new User({ username, password, role });

        await user.save();
        
        // 3. Respond with success
        res.status(201).json({ message: `${user.role} user created successfully.` });

    } catch (err) {
        console.error('Registration Error:', err.message);
        // Handle Mongoose validation errors (e.g., missing required field or bad enum value)
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).send('Server error during user registration.');
    }
});

// --- POST /api/auth/login (Primary Login Route) ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body; 
    try {
        // 1. Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 2. Compare the plain password with the HASHED password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        // 3. Create and return JWT payload
        const payload = {
            // Simplified payload for JWT: ID, username, and role
            id: user.id,
            username: user.username,
            role: user.role
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Must be defined in your .env file
            { expiresIn: '1h' }, 
            (err, token) => {
                if (err) throw err;
                
                // Send the token and user details back to the frontend
                res.json({ 
                    message: 'Login successful.',
                    token, 
                    role: user.role, 
                    username: user.username 
                });
            }
        );
    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).send('Server error during login.');
    }
});

module.exports = router;