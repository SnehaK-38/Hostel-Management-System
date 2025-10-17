// about.jsx - STYLED
import React, { useState } from "react";
import Fee from "./Fee";
import Mess from "./Mess";
import Rules from "./Rules";
import Chats from "./Chats";

function About() {
    const [activeComponent, setActiveComponent] = useState("Rules");

    const renderComponent = () => {
        switch (activeComponent) {
            case "Fee":
                return <Fee />;
            case "Mess":
                return <Mess />;
            case "Rules":
                return <Rules />;
            case "Chats":
                return <Chats />;
            default:
                return <Rules />;
        }
    };

    // Helper function to check if a tab is active
    const getTabClass = (tabName) =>
        activeComponent === tabName ? "tab-button active" : "tab-button";

    return (
        <div className="about-page">
            {/* Tabs */}
            <div className="about-tabs">
                <button
                    className={getTabClass("Fee")}
                    onClick={() => setActiveComponent("Fee")}
                >
                    Fee Structure
                </button>
                <button
                    className={getTabClass("Mess")}
                    onClick={() => setActiveComponent("Mess")}
                >
                    Mess
                </button>
                <button
                    className={getTabClass("Rules")}
                    onClick={() => setActiveComponent("Rules")}
                >
                    Rules & Regulations
                </button>
                <button
                    className={getTabClass("Chats")}
                    onClick={() => setActiveComponent("Chats")}
                >
                    Chats
                </button>
            </div>

            {/* Content */}
            <div className="about-content">
                {renderComponent()}
            </div>
        </div>
    );
}

export default About;
