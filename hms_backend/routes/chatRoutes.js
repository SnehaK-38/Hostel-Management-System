const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController'); 

// ----------------------------------------------------
// AI GENERATION ROUTE (Calls the Gemini API securely)
// ----------------------------------------------------

/**
 * @route POST /api/chat/generate
 * @description Calls the secure backend controller to generate a response from the Gemini AI model.
 * This is the route called by the Chat.jsx component.
 * @access Private (Requires authentication/verification)
 */
router.post('/generate', chatController.generateChatResponse);

// ----------------------------------------------------
// HOSTEL CHAT MESSAGING ROUTES (General CRUD/Placeholder)
// ----------------------------------------------------

/**
 * @route GET /api/chat/history/:hostelId
 * @description Fetches the chat history for a specific hostel.
 * @access Private (Requires authentication)
 */
router.get('/history/:hostelId', async (req, res) => {
    // This route is fine, it sends back JSON
    res.status(501).json({ message: 'History retrieval not yet implemented.' });
});

/**
 * @route POST /api/chat/send
 * @description Saves a new message to the database.
 * @access Private (Requires authentication)
 */
router.post('/send', async (req, res) => {
    // This route is fine, it sends back JSON
    res.status(501).json({ message: 'Message saving not yet implemented.' });
});

module.exports = router;
