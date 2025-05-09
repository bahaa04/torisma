import { useState, useRef, useEffect } from 'react';
import '../styles/ChatPage.css';
import Footer from '../components/footer';
import NavBarC from '../components/navbar1-connected';
import NavBar from '../components/navbar1';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch CSRF token when component mounts
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(`${API_URL}/recommendations/api/csrf-token/`);
        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { text: inputValue, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/recommendations/api/recommend/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'X-CSRFToken': csrfToken
        },
        body: JSON.stringify({ query: inputValue })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && data.login_required) {
          const authMessage = {
            text: data.error,
            isUser: false,
            loginRequired: true,
            loginUrl: data.login_url,
            loginText: data.login_text
          };
          setMessages(prev => [...prev, authMessage]);
          return;
        }
        throw new Error(data.error || 'Échec de la requête');
      }

      const botMessage = { 
        text: data.response || "Désolé, je n'ai pas pu comprendre votre demande.", 
        isUser: false 
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      let errorMessage;
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        errorMessage = "Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.";
      } else {
        errorMessage = error.message || "Erreur de connexion au service de recommandations.";
      }
      
      const errorResponse = { 
        text: errorMessage,
        isUser: false 
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessage = (msg) => {
    if (msg.loginRequired) {
      return (
        <div className="message-bubble bot-message">
          {msg.text}
          <a href={msg.loginUrl} className="login-link">
            {msg.loginText}
          </a>
        </div>
      );
    }
    return <div className={`message-bubble ${msg.isUser ? 'user-message' : 'bot-message'}`}>{msg.text}</div>;
  };

  return (
    <div className="chat-page-container">
      <NavBarC />
      
      <div className="chat-main-container">
        <h2 className="chat-header">
          Assistant de Recommandation Touristique
        </h2>

        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className={`message-wrapper ${msg.isUser ? 'user' : 'bot'}`}>
              {renderMessage(msg)}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Posez votre question sur les destinations..."
            className="chat-input"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="send-button"
          >
            {isLoading ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChatPage;