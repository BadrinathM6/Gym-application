import React, { useState, useRef, useEffect } from 'react';
import Lottie from 'lottie-react';
import axiosInstance from './utils/axiosInstance';
import ChatBackground from '../assets/chat-background.jpg'; 
import UserIcon from '../assets/user-icon.jpg'; 
import AIIcon from '../assets/ai-icon.jpg'; 
import LoaderAnimation from './threedot.json';
import '../css/ChatPage.css';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { type: 'ai', message: 'Of course! What goals do you have in mind?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    // Add user message
    const newUserMessage = { type: 'user', message: inputMessage };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send message to backend
      const response = await axiosInstance.post('/ai-chat/', { 
        message: inputMessage 
      });

      const aiResponse = { 
        type: 'ai', 
        message: response.data.message 
      };

      // Add a slight delay to make the loading feel more natural
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, aiResponse]);
        setIsLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { 
        type: 'ai', 
        message: 'Sorry, there was an error processing your request. Please try again.' 
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div
      className="chat-page"
    >
      {/* Chat Header */}
      <div className="chat-header">
        <img src={AIIcon} alt="AI" className="ai-icon" />
        <h2 className="chat-title">BUFFALO AI</h2>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`chat-bubble ${msg.type === 'user' ? 'user-bubble' : 'ai-bubble'}`}
          >
            <img 
              src={msg.type === 'user' ? UserIcon : AIIcon} 
              alt={msg.type === 'user' ? "User" : "AI"} 
              className="profile-icon" 
            />
            <p>{msg.message}</p>
          </div>
        ))}
        
        {/* Lottie Loader */}
        {isLoading && (
          <div className="lottie-loader-container">
            <Lottie 
              animationData={LoaderAnimation} 
              loop={true} 
              className="lottie-loader"
            />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="chat-input">
        <button className="icon-button">📷</button>
        <input
          type="text"
          placeholder="Ask Buffalo AI"
          className="text-input"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <button 
          className="icon-button"
          onClick={handleSendMessage}
          disabled={isLoading}
        >
          {isLoading ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  );
};

export default ChatPage;