const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    // The role field is crucial for authorization
    role: { 
        type: String,
        required: true,
        // *** FIX: Changed to capitalized roles to match validation expectations ***
        enum: ['Admin', 'Student'], 
    },
    date: {
        type: Date,
        default: Date.now
    }
});

// --- Password Hashing Pre-save Hook ---
// Hash the password before saving the user to the database
UserSchema.pre('save', async function (next) {
    // Only hash if the password field has been modified (or is new)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);
        // Hash the password
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

module.exports = mongoose.model('User', UserSchema);