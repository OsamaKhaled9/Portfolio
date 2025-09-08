import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import './ChatBot.css';

const ChatBot = () => {
  const { isDarkMode } = useTheme();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      message: 'Hi! I\'m Osama\'s AI assistant. Ask me anything about his experience, projects, or skills!'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      message: inputMessage
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate bot response (replace with actual RAG implementation later)
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        message: 'Thanks for your question! This RAG system will be fully implemented soon. For now, please explore the portfolio sections above or contact Osama directly.'
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="chat-toggle-container">
        <span className={`chat-tooltip ${isChatOpen ? 'hidden' : ''}`}>Text me</span>
        <button 
          className="chat-toggle-btn"
          onClick={() => setIsChatOpen(!isChatOpen)}
          aria-label="Toggle chat"
        >
          <div className="chat-btn-border">
            <div className="chat-btn-icon">
              {isChatOpen ? <X size={20} /> : <MessageCircle size={20} />}
            </div>
          </div>
        </button>
      </div>

      {/* Chat Window */}
      {isChatOpen && (
        <div className={`chat-window ${isDarkMode ? 'dark' : 'light'}`}>
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <MessageCircle size={16} />
              </div>
              <div>
                <h4>Chat with Osama</h4>
                <span>AI Assistant • Usually replies instantly</span>
              </div>
            </div>
            <button 
              onClick={() => setIsChatOpen(false)}
              className="chat-close-btn"
            >
              <X size={16} />
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`chat-message ${msg.type}`}
              >
                <div className="message-content">
                  {msg.message}
                </div>
                <div className="message-time">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>

          <div className="chat-input-container">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me about Osama's experience..."
              className="chat-input"
            />
            <button 
              onClick={handleSendMessage}
              className="chat-send-btn"
              disabled={!inputMessage.trim()}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;