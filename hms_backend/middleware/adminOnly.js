// hms_backend/middleware/adminOnly.js

/**
 * Middleware function to restrict access to only users with the 'admin' role.
 * This MUST be run AFTER the protectRoute middleware (auth.js), as it relies on 
 * req.user being populated with the decoded token data (including the role).
 */
const adminOnly = (req, res, next) => {
    // 1. Check if user data exists (guaranteed by protectRoute, but good for safety)
    if (!req.user || !req.user.role) {
        return res.status(403).json({ 
            message: 'Access Denied: User role is missing. Authentication is required first.' 
        });
    }

    // 2. Check if the user's role is exactly 'admin' (assuming roles are stored in lowercase)
    if (req.user.role === 'admin') {
        // User is an Admin, proceed to the next handler
        next();
    } else {
        // User is authenticated but is not an Admin (e.g., they are a 'student')
        return res.status(403).json({ 
            message: 'Access Denied: Only users with the Admin role can perform this operation.' 
        });
    }
};

module.exports = adminOnly;