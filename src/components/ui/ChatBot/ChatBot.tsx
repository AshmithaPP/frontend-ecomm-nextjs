"use client";

import React, { useState, useEffect, useRef } from 'react';
import './chatBot.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, text: "Hi there! 👋 How can I help you today?", sender: 'bot', time: new Date() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            text: inputValue,
            sender: 'user',
            time: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        setInputValue('');

        // Mock bot response
        setTimeout(() => {
            const botResponse = {
                id: messages.length + 2,
                text: "Thanks for your message! Our team will get back to you shortly, or you can ask me about shipping and returns.",
                sender: 'bot',
                time: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    return (
        <div className="chatbot-container">
            {/* Floating Toggle Button */}
            <button 
                className={`chatbot-toggle ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle chat"
            >
                {isOpen ? <i className="bi bi-x-lg"></i> : <i className="bi bi-chat-dots-fill"></i>}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="chat-window shadow-lg animate-slide-up">
                    <div className="chat-header">
                        <div className="d-flex align-items-center">
                            <div className="bot-avatar me-2">
                                <i className="bi bi-robot"></i>
                            </div>
                            <div>
                                <h6 className="m-0">SareeEcom Support</h6>
                                <small className="text-success">● Online</small>
                            </div>
                        </div>
                        <button className="btn-close-chat" onClick={() => setIsOpen(false)}>
                            <i className="bi bi-dash-lg"></i>
                        </button>
                    </div>

                    <div className="chat-messages p-3">
                        {messages.map(msg => (
                            <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
                                <div className="message-bubble">
                                    {msg.text}
                                </div>
                                <div className="message-time">
                                    {msg.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input-area p-2 d-flex" onSubmit={handleSendMessage}>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Type a message..." 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button type="submit" className="btn-send ms-2">
                            <i className="bi bi-send-fill"></i>
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
