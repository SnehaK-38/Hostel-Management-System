import React, { useState } from "react";
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import Register from './Register';
import Complain from './Complain';
import Payment from './Payment';
import Chat from './Chat';
import AdminDataView from './AdminDataView'; // <-- 1. NEW IMPORT for Admin View
import './Dashboard.css';

function Dashboard({ loggedInUser }) {
  
  // 2. Determine User Role from the prop
  // We assume loggedInUser is an object like: { username: 'Admin1', role: 'Admin' }
  const userRole = loggedInUser?.role || 'Student'; 

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(!isSidebarOpen);
      setOpenSidebarToggle(!openSidebarToggle);
    }
  }

  const initialState = {
    home: true,
    register: false,
    complain: false,
    payment: false,
    chat: false,
  }

  const [isClicked, setIsClicked] = useState(initialState);
  const [isDashboard, setIsDashboard] = useState(initialState.home);

  const handleDashboard = () => {
    setIsDashboard(false);
  }

  const handleDashboardAgain = () => {
    setIsDashboard(true);
  }

  const handleClick = (clicked) => {
    setIsClicked({ ...initialState, [clicked]: true });
  }

  // 3. Conditional Content Renderer Function
  const renderContent = () => {
    // If the user is an Admin, always show the Admin Data View on the "Dashboard" click.
    if (userRole === 'Admin') {
      return <AdminDataView />; 
    } 
    
    // If the user is a Student, use the existing rendering logic.
    if (isClicked.home && isDashboard) {
        return <Home />;
    }
    if (isClicked.register) {
        return <Register />;
    }
    if (isClicked.complain) {
        return <Complain />;
    }
    if (isClicked.payment) {
        return <Payment />;
    }
    if (isClicked.chat) {
        return <Chat />;
    }
    return <Home />; // Fallback
  };


  return (
    <div className={`grid-container app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* 4. Use loggedInUser.username for safety and consistency */}
      <Header OpenSidebar={OpenSidebar} username={loggedInUser?.username || "Guest"} /> 
      <Sidebar
        handleDashboardAgain={handleDashboardAgain}
        handleDashboard={handleDashboard}
        handleClick={handleClick}
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
        userRole={userRole} // <-- 5. Pass role to the Sidebar (required if you want to modify sidebar links later)
      />
      <div className="dashboard-content">
        {/* 6. Use the conditional rendering function */}
        {renderContent()}
      </div>
    </div>
  )
}

export default Dashboard;