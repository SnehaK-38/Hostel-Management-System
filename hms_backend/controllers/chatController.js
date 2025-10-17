// hms_backend/controllers/chatController.js

/**
 * Chat Controller handles logic for communicating with the Gemini LLM API
 * to provide a conversational AI assistant.
 * * CRITICAL SECURITY NOTE: The GEMINI_API_KEY MUST be loaded from environment variables
 * (e.g., process.env.GEMINI_API_KEY) and NEVER hardcoded.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";
const SYSTEM_INSTRUCTION = `You are a friendly, helpful, and professional AI Assistant for the SAKEC Hostel Management System (HMS). Your primary role is to answer questions related to:
1. Student applications and registration status.
2. Hostel fees, payment methods, and due dates.
3. General hostel rules, facilities, and procedures (e.g., check-in, check-out, visitor policies).
4. Do not answer questions outside of hostel or academic context.
5. Keep responses concise and use clear, professional language.
6. If a specific student ID or sensitive information is requested, state clearly that you cannot access personal data for security reasons and direct them to contact a human administrator.`;

/**
 * Helper function for exponential backoff during API calls
 */
const fetchWithRetry = async (url, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Unknown API error' }));
                if (response.status >= 500 && i < retries - 1) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
                    continue;
                }
                throw new Error(errorData.message || `External API failed with status: ${response.status}`);
            }
            return response;
        } catch (error) {
            if (i === retries - 1) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
    }
};


/**
 * POST /api/chat/generate
 * Generates an AI response based on the provided chat history.
 */
const generateChatResponse = async (req, res) => {
    if (!GEMINI_API_KEY) {
        return res.status(500).json({ message: "Server configuration error: Gemini API Key is missing." });
    }
    
    const { userId, history } = req.body; 

    if (!history || history.length === 0) {
        return res.status(400).json({ message: "Chat history is required." });
    }

    try {
        const contents = history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const payload = {
            contents: contents,
            systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }]
            },
            tools: [{ "google_search": {} }],
        };

        const options = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };

        const response = await fetchWithRetry(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, options);
        const result = await response.json();

        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
            const aiResponseText = candidate.content.parts[0].text;
            
            return res.status(200).json({ response: aiResponseText });
        } else {
             // If AI response is empty, it's often due to safety block or internal error
             return res.status(500).json({ message: "AI response was empty. Content may have been blocked or service failed." });
        }

    } catch (error) {
        console.error('Gemini API Integration Error:', error.message);
        return res.status(500).json({ 
            message: "The AI Assistant is currently unavailable. Please try again later.",
            debug: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    generateChatResponse
};
