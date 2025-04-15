import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../services/axiosInstance';
import './ChatBot.css'; // Vous devrez créer ce fichier CSS

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fonction pour faire défiler vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Ajouter un message de bienvenue au chargement
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        text: 'Bonjour ! Je suis votre assistant. Comment puis-je vous aider aujourd\'hui ?',
        sender: 'bot'
      }
    ]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user'
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    try {
        const response = await axiosInstance.get(`/chat?message=${encodeURIComponent(input)}`);
        
        let messageContent = "";
        
        if (response.data && response.data.content) {
          // Utiliser directement le contenu extrait par le backend
          messageContent = response.data.content;
        } else if (response.data && response.data.status === "error") {
          messageContent = response.data.content || "Une erreur s'est produite.";
        } else {
          messageContent = "Je n'ai pas pu traiter votre demande.";
        }
        
        const botMessage = {
          id: Date.now() + 1,
          text: messageContent,
          sender: 'bot'
        };
        
        setMessages(prevMessages => [...prevMessages, botMessage]);
      } catch (error) {
        // Gestion d'erreur inchangée
      
      console.error("Erreur lors de la communication avec l'API:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Désolé, une erreur s'est produite lors du traitement de votre demande.",
        sender: 'bot'
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Formatter le message pour gérer le code source
  const formatMessage = (text) => {
    // Vérifier si le texte contient du code
    if (text.includes('```')) {
      const parts = text.split(/```([a-z]*)\n([\s\S]*?)```/g);
      return (
        <>
          {parts.map((part, index) => {
            // Si c'est un langage de programmation
            if (index % 3 === 1) {
              return <div key={index} className="code-language">{part}</div>;
            }
            // Si c'est du code
            else if (index % 3 === 2) {
              return (
                <pre key={index} className="code-block">
                  <code>{part}</code>
                </pre>
              );
            }
            // Si c'est du texte normal
            else {
              return part.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ));
            }
          })}
        </>
      );
    }
    
    // Si pas de code, retourner le texte avec des sauts de ligne
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Assistant IA</h2>
      </div>
      
      <div className="messages-container">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              {formatMessage(message.text)}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot-message">
            <div className="message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tapez votre message ici..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? 'Envoi...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
};

export default ChatBot;