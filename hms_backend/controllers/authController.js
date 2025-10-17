// hms_backend/controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// NOTE: This secret key MUST match the one used in your middleware/auth.js
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_from_env'; 

/**
 * Generates a JSON Web Token (JWT) for the authenticated user.
 * @param {object} user - The user object from the database.
 */
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' } // Token expires in 1 hour
    );
};


// @desc    Register a new user (used during initial system setup or student registration)
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Simple validation
        if (!username || !password || !role) {
            return res.status(400).json({ message: 'Please enter all fields.' });
        }

        // Check for existing user
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        // Create new user instance (password hashing happens in the User Model pre-save hook)
        user = new User({
            username,
            password, 
            role, // Should be capitalized ('Admin' or 'Student')
        });

        await user.save();
        
        // Issue a token upon successful registration
        const token = generateToken(user);

        res.status(201).json({ 
            message: 'Registration Successful! Token issued for immediate login.',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            }
        });

    } catch (err) {
        // This is often hit if the Mongoose enum validation fails
        console.error('Registration Error:', err.message);
        res.status(500).json({ message: `Registration failed. Server Error: ${err.message}` });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Please enter username and password.' });
        }

        // 1. Check for user existence
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials.' });
        }

        // 2. Compare submitted password with hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials.' });
        }
        
        // 3. Generate token if credentials are valid
        const token = generateToken(user);

        res.json({
            message: 'Login Successful!',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            }
        });

    } catch (err) {
        console.error('Login Error:', err.message);
        res.status(500).send('Server Error during login.');
    }
};