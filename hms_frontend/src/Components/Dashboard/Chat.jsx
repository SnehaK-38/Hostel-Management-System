import React, { useState, useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Send, Loader2 } from 'lucide-react'; 
import './Chat.css'; // <-- Importing the pure CSS file

const Chat = () => {
    // Initial AI greeting message
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hello! I'm your HMS assistant. How can I help you with your application, fees, or general inquiries today?", isAI: true }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Placeholder for a unique user ID, in a real app this would come from Auth context
    const mockUserId = 'student-12345'; 
    const messagesEndRef = useRef(null); // Ref for auto-scrolling

    // Auto-scroll to the bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();

        // 1. Add user message to state immediately
        const newUserMessage = { role: 'user', content: userMessage, isAI: false };
        setMessages(prev => [...prev, newUserMessage]);
        setInputMessage('');
        setIsLoading(true);

        // 2. Prepare chat history for the API call
        const chatHistory = [...messages, newUserMessage];
        
        // Convert history format to the API expected 'model'/'user' roles
        const historyPayload = chatHistory.map(msg => ({
            role: msg.role === 'ai' ? 'model' : 'user', 
            content: msg.content
        }));

        try {
            // NOTE: This call is assumed to be handled by a secure backend route
            const response = await fetch('/api/chat/generate', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: mockUserId, history: historyPayload })
            });

            const data = await response.json();

            if (response.ok && data.response) {
                // 3. Receive and add the AI response
                setMessages(prev => [...prev, { role: 'ai', content: data.response, isAI: true }]);
            } else {
                toast.error(data.message || "Chat API Error: Failed to get AI response.");
                setMessages(prev => prev.slice(0, prev.length - 1)); 
            }
        } catch (error) {
            console.error('Chat API Error:', error);
            toast.error("Network Error. Cannot connect to the server.");
            setMessages(prev => prev.slice(0, prev.length - 1));
        } finally {
            setIsLoading(false);
        }
    };

    // Component rendering logic
    return (
        // Uses pure CSS class 'chat-container'
        <div className="chat-container"> 
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Header */}
            <div className="chat-header">
                <div className="header-avatar">AI</div>
                <div>
                    <h2 className="header-title">HMS AI Assistant</h2>
                    <p className="header-subtitle">Ask me anything about fees, rules, or applications.</p>
                </div>
            </div>

            {/* Message Area */}
            <div className="message-area">
                {messages.map((message, index) => {
                    const isAI = message.role === 'ai';
                    
                    const containerClass = isAI ? 'message-container' : 'message-container user-container';
                    const bubbleClass = isAI ? 'ai-bubble' : 'user-bubble';
                    const avatarClass = isAI ? 'avatar ai-avatar' : 'avatar user-avatar';

                    return (
                        <div key={index} className={containerClass}>
                            {/* AI Avatar */}
                            {isAI && (
                                <div className={avatarClass}>AI</div>
                            )}

                            {/* Message Bubble */}
                            <div className={bubbleClass}>
                                <p className="whitespace-pre-wrap">{message.content}</p>
                            </div>

                            {/* User Avatar */}
                            {!isAI && (
                                <div className={avatarClass}>You</div>
                            )}
                        </div>
                    );
                })}
                
                {/* Loading Indicator */}
                {isLoading && (
                    <div className="message-container">
                        <div className="avatar ai-avatar">AI</div>
                        <div className="loading-bubble">
                            {/* Spin keyframe is defined below and applied via inline style */}
                            <Loader2 style={{ width: '20px', height: '20px', display: 'inline', marginRight: '8px', animation: 'spin 1s linear infinite' }} />
                            <span>Assistant is typing...</span>
                        </div>
                    </div>
                )}
                
                {/* Define CSS keyframe for the spinner here since we are not using Tailwind */}
                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>

                <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="input-form">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask a question about your application, fees, or procedures..."
                    className="input-field"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="send-button"
                    disabled={!inputMessage.trim() || isLoading}
                >
                    <Send style={{ width: '20px', height: '20px' }} />
                </button>
            </form>
        </div>
    );
};

export default Chat;
