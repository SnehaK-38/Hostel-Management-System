import React, { Component } from "react";

// --- Hardcoded Admin Credentials ---
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

class Login extends Component {
    state = {
        username: "",
        password: "",
        isLoading: false,
        selectedRole: null, // null, 'Admin', or 'Student'
        message: null,      // For custom messages/errors
        messageType: null   // 'success' or 'error'
    };

    // Custom function to show messages instead of toast
    showMessage = (text, type) => {
        this.setState({ message: text, messageType: type });
        setTimeout(() => this.setState({ message: null, messageType: null }), 3000);
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, message: null });
    };

    handleRoleSelect = (role) => {
        this.setState({ selectedRole: role, username: "", password: "", message: null });
    };

    handleLoginSuccess = (user) => {
        const userObject = {
            username: user.username,
            role: user.role,
            token: user.token || `${user.username}-${Date.now()}` // Mock token if not provided
        };

        // 1. Store the essential data in localStorage for session persistence
        localStorage.setItem('authToken', userObject.token);
        localStorage.setItem('userRole', userObject.role);
        localStorage.setItem('username', userObject.username);

        // 2. Call the parent function to update state and switch to dashboard
        if (this.props.onLoginSuccess) {
            this.props.onLoginSuccess(userObject);
            this.showMessage("Welcome, " + userObject.username + "!", 'success');
        }
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password, selectedRole } = this.state;

        if (!username || !password) {
            this.showMessage("Please enter both username and password.", 'error');
            return;
        }

        this.setState({ isLoading: true });

        try {
            if (selectedRole === 'Admin') {
                // --- ADMIN LOGIN LOGIC (MOCKED) ---
                if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                    this.handleLoginSuccess({ username: 'AdminUser', role: 'Admin' });
                } else {
                    this.showMessage('Invalid Admin ID or Password. Hint: admin / password123', 'error');
                }
            } else if (selectedRole === 'Student') {
                // --- STUDENT LOGIN LOGIC (API CALL) ---
                const response = await fetch('http://localhost:5000/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password, role: 'Student' }),
                });

                const data = await response.json();

                if (response.ok) {
                    const token = data.token;
                    const role = data.role || 'Student';
                    const respUsername = data.username;

                    if (!token || !respUsername) {
                        throw new Error("Login response missing token or user data.");
                    }
                    this.handleLoginSuccess({ username: respUsername, role: role, token: token });

                } else {
                    const errorMessage = data.message || 'Login failed due to invalid credentials or server error.';
                    this.showMessage(errorMessage, 'error');
                }
            }
        } catch (error) {
            console.error('Login Error:', error);
            this.showMessage("A network error occurred. Ensure the backend is running on port 5000.", 'error');
        } finally {
            this.setState({ isLoading: false });
        }
    };

    // --- Render Methods ---

    renderRoleSelection() {
        return (
            <div className="login-card">
                <h2>Select User Role</h2>
                <div className="role-buttons">
                    <button className="admin-button" onClick={() => this.handleRoleSelect('Admin')}>
                        Admin
                    </button>
                    <button className="student-button" onClick={() => this.handleRoleSelect('Student')}>
                        Student
                    </button>
                </div>
                <p className="register-text">
                    New student? 
                    <span className="signup-link" onClick={() => this.props.setCurrentPage('register')}>
                        Register here.
                    </span>
                </p>
                <p className="back-link" onClick={() => this.props.setCurrentPage('home')}>
                    ← Back to Home
                </p>
            </div>
        );
    }

    renderLoginForm() {
        const { username, password, isLoading, selectedRole, message, messageType } = this.state;
        const isStudent = selectedRole === 'Student';

        return (
            <div className="login-box">
                <h2>{isStudent ? 'Student Login' : 'Admin Login'}</h2>
                {message && (
                    <div className={messageType === 'error' ? 'error-message' : 'success-message'}>
                        {message}
                    </div>
                )}
                {selectedRole === 'Admin' && (
                    <p className="admin-hint">
                        Admin Mock Credentials: <strong>admin</strong> / <strong>password123</strong>
                    </p>
                )}
                <form className="login-form" onSubmit={this.handleSubmit}>
                    <input 
                        type="text" 
                        name="username" 
                        placeholder={isStudent ? "Roll Number" : "Admin ID"} 
                        value={username} 
                        onChange={this.handleChange} 
                        required 
                        disabled={isLoading}
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={this.handleChange} 
                        required 
                        disabled={isLoading}
                    />

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Logging In..." : "Login"}
                    </button>
                </form>
                
                <p className="back-link" onClick={() => this.handleRoleSelect(null)}>
                    ← Back to Role Selection
                </p>
            </div>
        );
    }

    render() {
        const { selectedRole } = this.state;

        return (
            <>
                {/* Integrated Styles */}
                <style jsx="true">{`
                    .login-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 80vh;
                        padding: 20px;
                        background-color: #f7f7f7;
                    }

                    .login-box, .login-card {
                        background: #ffffff;
                        padding: 40px;
                        border-radius: 12px;
                        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
                        width: 100%;
                        max-width: 400px;
                        text-align: center;
                    }

                    .login-box h2, .login-card h2 {
                        margin-bottom: 25px;
                        color: #333;
                        font-size: 1.8em;
                    }

                    .role-buttons {
                        display: flex;
                        gap: 15px;
                        margin-bottom: 30px;
                        justify-content: center;
                    }

                    .role-buttons button {
                        padding: 12px 25px;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-weight: 600;
                        transition: background-color 0.3s, transform 0.1s;
                        color: white;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        flex-grow: 1; 
                    }

                    .admin-button { background-color: #ffc107; color: #333; }
                    .student-button { background-color: #28a745; }
                    
                    .admin-button:hover { background-color: #e0a800; transform: translateY(-2px); }
                    .student-button:hover { background-color: #1e7e34; transform: translateY(-2px); }

                    .login-form input {
                        width: calc(100% - 20px);
                        padding: 12px 10px;
                        margin-bottom: 15px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                        box-sizing: border-box;
                        font-size: 16px;
                    }

                    .login-form input:focus {
                        border-color: #007bff;
                        outline: none;
                    }

                    .login-form button[type="submit"] {
                        width: 100%;
                        padding: 12px;
                        border: none;
                        border-radius: 8px;
                        background-color: #007bff; 
                        color: white;
                        font-size: 1.1em;
                        font-weight: 700;
                        cursor: pointer;
                        transition: background-color 0.3s, opacity 0.3s;
                        margin-top: 10px;
                    }

                    .login-form button[type="submit"]:hover:not(:disabled) {
                        background-color: #0056b3;
                    }

                    .login-form button[type="submit"]:disabled {
                        background-color: #ccc;
                        cursor: not-allowed;
                        opacity: 0.8;
                    }

                    .error-message {
                        color: #dc3545;
                        background-color: #f8d7da;
                        border: 1px solid #f5c6cb;
                        padding: 0.75rem;
                        border-radius: 6px;
                        margin-bottom: 1rem;
                        font-size: 0.9rem;
                        text-align: center;
                    }

                    .success-message {
                        color: #155724;
                        background-color: #d4edda;
                        border: 1px solid #c3e6cb;
                        padding: 0.75rem;
                        border-radius: 6px;
                        margin-bottom: 1rem;
                        font-size: 0.9rem;
                        text-align: center;
                    }

                    .admin-hint {
                        background-color: #fff3cd;
                        border: 1px solid #ffeeba;
                        color: #856404;
                        padding: 0.75rem;
                        border-radius: 6px;
                        margin-bottom: 1rem;
                        font-size: 0.85rem;
                        text-align: center;
                    }

                    .back-link, .register-text {
                        display: block;
                        margin-top: 20px;
                        font-size: 0.95em;
                        text-align: center;
                    }
                    
                    .back-link {
                        color: #007bff;
                        cursor: pointer;
                        transition: color 0.3s;
                    }

                    .back-link:hover {
                        color: #0056b3;
                        text-decoration: underline;
                    }

                    .register-text {
                        margin-top: 15px;
                        font-size: 0.9em;
                        color: #666;
                    }

                    .signup-link {
                        color: #007bff;
                        cursor: pointer;
                        font-weight: bold;
                        text-decoration: none;
                    }

                    .signup-link:hover {
                        text-decoration: underline;
                    }
                `}</style>
                
                <div className="login-container">
                    {/* The ToastContainer import was removed */}
                    {selectedRole === null ? this.renderRoleSelection() : this.renderLoginForm()}
                </div>
            </>
        );
    }
}

export default Login;
