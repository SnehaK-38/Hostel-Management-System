import React, { Component } from "react";
import { ToastContainer, toast } from 'react-toastify';
// Assuming 'Signup.css' contains styling for .signup-container, .signup-box, etc.
import "./Signup.css"; 

class Signup extends Component {
    // Role is now pre-set to 'student'
    state = {
        role: "student", 
        username: "",
        password: "",
        confirmPassword: "",
        isLoading: false,
    };

    // Removed handleRoleSelect as selection UI is gone
    handleChange = (e) => this.setState({ [e.target.name]: e.target.value });
    
    // Helper function provided by App.js to switch pages
    handlePageChange = (page) => {
        if (this.props.setCurrentPage) {
            this.props.setCurrentPage(page);
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { role, username, password, confirmPassword } = this.state;
        
        // --- Client-side validation ---
        // Removed the check for `if (!role)` as it's now defaulted
        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
        
        // Role is always 'student', but we ensure it's capitalized for the backend
        const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1); // will be "Student"
        
        // --- API Call ---
        this.setState({ isLoading: true });

        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    role: capitalizedRole, // Always sends 'Student'
                }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || "Registration Successful! Please log in.");
                this.handlePageChange('login'); 
            } else {
                const errorMessage = data.message || 'Registration failed due to server error.';
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Network Error during registration:', error);
            toast.error("A network error occurred. Ensure the backend is running on port 5000.");
        } finally {
            this.setState({ isLoading: false });
        }
    };

    render() {
        const { username, password, confirmPassword, isLoading } = this.state;

        return (
            <div className="signup-container">
                <ToastContainer position="top-center" autoClose={3000} />
                <div className="signup-box">
                    {/* Role selection UI block removed entirely */}
                    <form className="signup-form" onSubmit={this.handleSubmit}>
                        {/* Title updated to reflect only Student signup */}
                        <h2>🎓 Student Signup</h2>
                        
                        <input 
                            type="text" 
                            name="username" 
                            placeholder="Username" 
                            value={username} 
                            onChange={this.handleChange} 
                            required 
                            disabled={isLoading}
                        />
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password (min 6 chars)" 
                            value={password} 
                            onChange={this.handleChange} 
                            required 
                            disabled={isLoading}
                        />
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            placeholder="Confirm Password" 
                            value={confirmPassword} 
                            onChange={this.handleChange} 
                            required 
                            disabled={isLoading}
                        />

                        <button type="submit" disabled={isLoading}>
                            {isLoading ? "Registering..." : "Sign Up"}
                        </button>
                        
                        {/* Removed the 'Change Role' link */}
                        <p className="link-to-login">
                            Already have an account? 
                            <span onClick={() => this.handlePageChange('login')}>
                                Login
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        );
    }
}

export default Signup;
