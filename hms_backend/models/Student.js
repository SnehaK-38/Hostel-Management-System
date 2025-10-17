// hms_backend/models/Student.js

const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    // Personal Details
    name: {
        type: String,
        required: true,
        trim: true,
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other'],
    },
    // Contact Information
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    phone: {
        type: String,
        required: true,
    },
    // Hostel Details
    roomNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    dateAdmitted: {
        type: Date,
        default: Date.now,
    },
    // Status
    isHosteler: {
        type: Boolean,
        default: true,
    },
    // Reference to the user who created this record (Admin)
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    }
}, {
    timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

module.exports = mongoose.model('Student', StudentSchema);