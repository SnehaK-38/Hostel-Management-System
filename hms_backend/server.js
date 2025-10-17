const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// Load environment variables from .env
require('dotenv').config();

const studentRoutes = require('./routes/studentRoutes'); 
const authRoutes = require('./routes/authRoutes'); 
// --- NEW IMPORTS ---
const paymentRoutes = require('./routes/paymentRoutes');
const chatRoutes = require('./routes/chatRoutes');
// -------------------

const app = express();

// --- Middleware Setup ---

// 1. Webhook Route Setup (MUST be before express.json() for Stripe/Razorpay)
// We use a dedicated parser for the webhook route to get the raw body string.
// This is critical for secure signature verification in the paymentController.
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// 2. General Middleware for ALL OTHER ROUTES
// CRITICAL FIX FOR CHAT: This allows the server to correctly parse JSON data from the frontend
app.use(express.json()); 
// This allows the server to handle URL-encoded data
app.use(express.urlencoded({ extended: true }));
// Allow all origins (*) for development
app.use(cors()); 

// --- Database Connection ---
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully!'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Initial Route Test ---
app.get('/', (req, res) => {
    res.send('HMS Backend is running!');
});

// --- ROUTE IMPLEMENTATION ---
app.use('/api/auth', authRoutes); // For secure user registration (setup) and login
app.use('/api/students', studentRoutes); // For registration, fetching, and status updates

// --- NEW ROUTES FOR HMS FEATURES ---
// Note: These paths must match the fetch calls in your React components
// NOTE: The /webhook path is implicitly handled by the special app.use above
app.use('/api/payment', paymentRoutes); // Handles fee payment initiation and webhooks
app.use('/api/chat', chatRoutes);       // Handles AI requests and message history
// -----------------------------------

// --- Start Server ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// NOTE on Chat: For real-time chat, you would typically integrate Socket.io
// here using the 'server' object created above.
