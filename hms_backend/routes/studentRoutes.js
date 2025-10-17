// hms_backend/routes/studentRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const Student = require('../models/Student'); 
const User = require('../models/User');     
// Import the JWT protection and the Admin role check from auth.js
const { protectRoute, isAdmin } = require('../middleware/auth'); 

// --- POST /api/students/register (Student Application & User Creation) ---
// NOTE: This route is PUBLIC as it is used for new student applications.
router.post('/register', async (req, res) => {
    // We expect core student details PLUS a password field from the frontend form
    const { rollNumber, password, name, email, phone, gender, roomNumber, dateAdmitted } = req.body; 

    // Simple check for required fields
    if (!rollNumber || !password || !name || !email || !phone || !gender || !roomNumber) {
        return res.status(400).json({ message: 'Please provide all required application details, including a login password.' });
    }

    try {
        // 1. Check if the User (login account) already exists using rollNumber as username
        let existingUser = await User.findOne({ username: rollNumber });
        if (existingUser) {
            return res.status(400).json({ message: 'A login account already exists for this Roll Number. Please try logging in.' });
        }
        
        // 2. Check if student or room already exists in the Student collection
        let existingStudent = await Student.findOne({ $or: [{ rollNumber }, { roomNumber }] });
        if (existingStudent) {
             return res.status(400).json({ message: 'A student with this Roll Number or Room Number is already registered.' });
        }

        // 3. Hash the password for the new User account
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // 4. Create the Student record
        const newStudent = new Student({
            name, 
            rollNumber, 
            gender, 
            email, 
            phone, 
            roomNumber, 
            dateAdmitted 
        });
        const student = await newStudent.save();

        // 5. Create the corresponding User (Login) account
        const newUser = new User({
            username: rollNumber, // Use rollNumber as the username for students
            password: hashedPassword,
            role: 'Student',
            email: email, 
            studentRef: student._id // Link the User account to the Student record
        });

        await newUser.save();

        // Respond with success message
        res.status(201).json({ 
            message: "Application successful! Your login username is your Roll Number. Please login now.",
            student 
        });

    } catch (err) {
        console.error('Student Registration Error:', err.message);
        
        // Handle Mongoose validation errors
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }

        res.status(500).send('Server Error during registration.');
    }
});


// --- GET /api/students/all (Fetch All Students - ADMIN ONLY) ---
// Middleware: Must be logged in (protectRoute) AND must be an Admin (isAdmin)
router.get('/all', protectRoute, isAdmin, async (req, res) => {
    try {
        const students = await Student.find().sort({ rollNumber: 1 }); // Sorted by rollNumber for admin view
        res.json(students);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error fetching all student data.');
    }
});

// --- PUT /api/students/status/:id (Update Student Record - ADMIN ONLY) ---
// Middleware: Must be logged in (protectRoute) AND must be an Admin (isAdmin)
router.put('/status/:id', protectRoute, isAdmin, async (req, res) => {
    try {
        const studentId = req.params.id;
        const updates = req.body; 

        // Safety measure: Prevent overwriting the ID
        delete updates._id; 
        
        if (Object.keys(updates).length === 0) {
             return res.status(400).json({ message: 'No fields provided for update.' });
        }

        const student = await Student.findByIdAndUpdate(
            studentId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        res.json(student);
    } catch (err) {
        console.error('Student Update Error:', err.message);
        if (err.name === 'ValidationError') {
             return res.status(400).json({ message: err.message });
        }
        res.status(500).send('Server Error during status update.');
    }
});

module.exports = router;