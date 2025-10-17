// src/Components/Navbar/Navbar.jsx
import React from "react";

function Navbar({ currentPage, setCurrentPage, loggedInUser, handleLogout }) {
  return (
    <nav className="main-navbar">
      <ul className="nav-list">
        <li>
          <button onClick={() => setCurrentPage("home")}>Home</button>
        </li>
        <li>
          <button onClick={() => setCurrentPage("about")}>About</button>
        </li>
        <li>
          <button onClick={() => setCurrentPage("gallery")}>More Hostels</button>
        </li>
        {loggedInUser ? (
          <>
            <li>
              <button onClick={() => setCurrentPage("dashboard")}>Dashboard</button>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <li>
            <button onClick={() => setCurrentPage("login")}>Login</button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
