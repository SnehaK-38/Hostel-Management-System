const Student = require('../models/Student');
const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

/**
 * Helper function to generate JWT token.
 */
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d', // 30 days expiration
    });
};

/**
 * @desc    Admin or Student registration/application handler
 * @route   POST /api/students/register
 * @access  Public
 * * NOTE: This endpoint is used by the frontend Register.jsx for new student sign-up.
 */
exports.registerStudent = async (req, res) => {
    // 1. Destructure all expected fields from the frontend payload
    const { 
        fullName, rollNumber, email, mobile, password, // User fields
        dob, father, gender, studentId, faculty, department, 
        issueDate, expiryDate, addressType, nationality, state, 
        district, blockNumber, wardNumber
    } = req.body;

    // Helper function to check if a value is effectively empty (null, undefined, or empty string after trimming)
    const isBlank = (value) => (value === undefined || value === null || (typeof value === 'string' && value.trim() === ''));

    // 2. CRITICAL BACKEND VALIDATION CHECK: REPORTS FIRST MISSING FIELD
    const requiredFields = {
        fullName, rollNumber, email, mobile, password, 
        dob, father, gender, studentId, faculty, department, 
        issueDate, expiryDate, addressType, nationality, state, 
        district, blockNumber, wardNumber
    };
    
    for (const [key, value] of Object.entries(requiredFields)) {
        if (isBlank(value)) {
            // Log the error on the server side
            console.error(`400 Bad Request: Validation failed. Missing field: ${key}. Value received: ${value}`);
            
            // Return a specific error message to the frontend (which Register.jsx will display)
            return res.status(400).json({ 
                message: `Server validation failed. The required field '${key}' is missing or blank.`,
            });
        }
    }

    try {
        // 3. Check if User (based on rollNumber/email) already exists
        let userExists = await User.findOne({ rollNumber });
        if (!userExists) {
            userExists = await User.findOne({ email });
        }
        
        if (userExists) {
            return res.status(400).json({ message: 'User with this Enrollment Number or Email already exists.' });
        }

        // 4. Create the new User for login
        const newUser = await User.create({
            rollNumber,
            email,
            password,
            fullName,
            role: 'student', 
            studentId
        });

        // 5. Create the Student application entry
        const newStudent = await Student.create({
            userId: newUser._id, 
            fullName, rollNumber, email, mobile, dob, father, gender, studentId, faculty, department, 
            issueDate, expiryDate, addressType, nationality, state, district,
            blockNumber: Number(blockNumber),
            wardNumber: Number(wardNumber), 
            status: 'Pending'
        });

        if (newUser && newStudent) {
            res.status(201).json({
                message: 'Registration successful! Application is pending admin approval.',
            });
        } else {
            res.status(400).json({ message: 'Invalid student data received.' });
        }
    } catch (error) {
        console.error('Student Registration Error:', error);
        // This catch block handles MongoDB errors (like validation errors, duplicate keys)
        if (error.code === 11000) { // Duplicate key error code
             return res.status(400).json({ message: 'An account with this Enrollment Number or Email already exists.' });
        }
        res.status(500).json({ message: 'Server error during registration process.', error: error.message });
    }
};

/**
 * @desc    Admin: Get all student applications
 * @route   GET /api/students
 * @access  Private/Admin
 */
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({}).select('-__v -createdAt -updatedAt'); 
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching all students:', error);
        res.status(500).json({ message: 'Failed to retrieve student applications.' });
    }
};

/**
 * @desc    Admin: Update student application status
 * @route   PUT /api/students/:id/status
 * @access  Private/Admin
 */
exports.updateStudentStatus = async (req, res) => {
    const { status } = req.body;
    const { id } = req.params; 

    if (!status || !['Approved', 'Rejected', 'Pending'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    try {
        const student = await Student.findById(id);

        if (!student) {
            return res.status(404).json({ message: 'Student application not found.' });
        }

        student.status = status;
        await student.save();

        res.status(200).json({ 
            message: `Student application status updated to ${status}.`, 
            student 
        });

    } catch (error) {
        console.error('Error updating student status:', error);
        res.status(500).json({ message: 'Failed to update student status.' });
    }
};

/**
 * @desc    Student: Get own application details
 * @route   GET /api/students/me
 * @access  Private/Student
 */
exports.getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findOne({ userId: req.user.id });

        if (!student) {
            return res.status(404).json({ message: 'Student profile not found.' });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student profile:', error);
        res.status(500).json({ message: 'Failed to retrieve student profile.' });
    }
};
