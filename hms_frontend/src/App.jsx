import React, { useState, useEffect } from "react";
import "./style.css";
import "./login.css";
import "./gallery.css";
import "./App.css";

import Home from "./Components/Home/Home";
import About from "./Components/About/About";
import Dashboard from "./Components/Dashboard/Dashboard";
import Login from "./login";
import Gallery from "./gallery";
import Navbar from "./Components/Home/Navbar";
import Signup from "./Components/Signup/Signup";
import StudentManager from "./Components/StudentManager"; // NEW: Import the Admin student management component

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  // loggedInUser will store the full user object (username, role, token)
  const [loggedInUser, setLoggedInUser] = useState(null); 

  // EFFECT for Session Persistence
  useEffect(() => {
    // Check localStorage for an existing token on app load/refresh
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    const username = localStorage.getItem('username');

    if (token && role && username) {
      // Re-hydrate the user state from localStorage
      setLoggedInUser({ username, role, token });
      setCurrentPage("dashboard");
    }
  }, []); // Run only once on mount

  // This function is called by the Login component on success
  const handleLoginSuccess = (userObject) => { 
    // userObject contains { username, role, token }
    setLoggedInUser(userObject);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    // Clear state and clear session data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');

    setLoggedInUser(null);
    setCurrentPage("home");
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <img
          className="logo"
          src="https://tse2.mm.bing.net/th/id/OIP.c6tkS32eSscMcswpWOmJ1gAAAA?pid=Api&P=0&h=180"
          alt="Hostel Logo"
        />
        <h1 className="hostel-name">SAKEC Hostel Management System</h1>
      </header>

      {/* Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        loggedInUser={loggedInUser}
        handleLogout={handleLogout}
      />

      {/* Page Rendering */}
      <main>
        {currentPage === "home" && <Home />}
        {currentPage === "about" && <About />}
        {currentPage === "gallery" && <Gallery />}

        {/* Login Page */}
        {currentPage === "login" && !loggedInUser && (
          <Login
            onLoginSuccess={handleLoginSuccess}
            setCurrentPage={setCurrentPage}
          />
        )}

        {/* Signup Page */}
        {currentPage === "register" && !loggedInUser && (
          <Signup
            setCurrentPage={setCurrentPage}
          />
        )}

        {/* Dashboard (Protected Route) */}
        {currentPage === "dashboard" && loggedInUser && (
          <>
            {loggedInUser.role === 'Admin' ? (
              // If the user is an Admin, show the Student Manager
              <StudentManager userRole={loggedInUser.role} />
            ) : (
              // Otherwise, show the regular student dashboard
              <Dashboard loggedInUser={loggedInUser} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
