// hms_backend/middleware/auth.js

const jwt = require('jsonwebtoken');

// Load the secret key securely from the environment variables (.env file)
const JWT_SECRET = process.env.JWT_SECRET; 

/**
 * Middleware function to verify the JSON Web Token (JWT) provided in the request header.
 * If the token is valid, it attaches the decoded user data (id, role, username) to req.user.
 */
const protectRoute = (req, res, next) => {
    // Header format is typically: "Authorization: Bearer <token>"
    const authHeader = req.header('Authorization');

    // 1. Check if the Authorization header is present and correctly formatted
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // 401 Unauthorized - Missing or malformed token
        return res.status(401).json({ 
            message: 'Access Denied. Token is missing or improperly formatted (must be "Bearer <token>").' 
        });
    }

    // 2. Extract the token (remove "Bearer ")
    const token = authHeader.replace('Bearer ', '');

    try {
        // 3. Verify the token using the secret key from the .env file
        const decoded = jwt.verify(token, JWT_SECRET);

        // 4. Attach the decoded user data to the request object
        req.user = decoded; 
        
        // 5. Proceed to the next middleware or route handler
        next();
    } catch (err) {
        // Token is invalid (e.g., expired, wrong signature)
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ message: 'Invalid token. Access denied.' });
    }
};

/**
 * Middleware function to check if the authenticated user has the 'Admin' role.
 * Must be used AFTER protectRoute.
 */
const isAdmin = (req, res, next) => {
    // req.user is set by protectRoute
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access Denied. Admin privileges required.' });
    }
};

module.exports = {
    protectRoute,
    isAdmin
};