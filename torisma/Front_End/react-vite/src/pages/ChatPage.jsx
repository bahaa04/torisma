import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/navbar1';
import NavbarC from '../components/navbar1-connected';
import Footer from '../components/footer';
import '../styles/ChatPage.css';

const UnauthorizedMessage = ({ onLogin }) => (
  <div>
    <p>Vous devez être connecté.</p>
    <button 
      onClick={onLogin}
      style={{
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '10px'
      }}
    >
      Se connecter
    </button>
  </div>
);

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    setIsAuthenticated(!!accessToken);
  }, []);

  const formatResponse = (response) => {
    // Handle bold and italic text
    let formattedResponse = response
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Handle numbered lists
    formattedResponse = formattedResponse.replace(/(\d+\.\s)(.+)/g, '<li>$1$2</li>');
    const numberedListRegex = /(<li>.*?<\/li>(?:\s*<li>.*?<\/li>)+)/gs;
    formattedResponse = formattedResponse.replace(numberedListRegex, '<ol>$1</ol>');

    // Handle paragraphs (split by double newlines)
    formattedResponse = formattedResponse.split(/\n\n+/).map(paragraph => {
      if (paragraph.startsWith("<ol>")) {
        return paragraph; // Don't wrap lists in <p> tags
      }
      return `<p>${paragraph.replace(/\n/g, '<br/>')}</p>`; // Single newlines within a paragraph become <br/>
    }).join('');

    return formattedResponse;
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, user: true }]);
      setInputValue('');
      try {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
          console.error('Access token not found.');
          setMessages(prevMessages => [...prevMessages, { 
            component: <UnauthorizedMessage onLogin={() => navigate('/connect')} />,
            user: false 
          }]);
          return;
        }

        const response = await axios.post(
          'http://127.0.0.1:8000/recommendations/api/recommend/',
          { query: inputValue },
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setMessages(prevMessages => [...prevMessages, { text: formatResponse(response.data.response), user: false }]);
      } catch (error) {
        console.error('Error fetching recommendation:', error);
        const errorMessage = error.response?.data?.error || 'Failed to get recommendation.';
        setMessages(prevMessages => [...prevMessages, { text: errorMessage, user: false }]);
      }
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-page-container">
      {isAuthenticated ? <NavbarC /> : <Navbar />}
      <div className="chat-main-container">
        <h1 className="chat-header">Recommandation</h1>
        <div className="messages-container">
          {messages.map((message, index) => (
            <div key={index} className={`message-wrapper ${message.user ? 'user' : 'bot'}`}>
              <div className={`message-bubble ${message.user ? 'user-message' : 'bot-message'}`}>
                {message.component || <div className="message-content" dangerouslySetInnerHTML={{ __html: message.text }} />}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <input
            type="text"
            className="chat-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Tapez votre question..."
          />
          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
          >
            Envoyer
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ChatPage;