// src/hooks/useWebSocket.js
import { useEffect, useRef } from 'react';

export const useWebSocket = (url, onMessage) => {
  const socketRef = useRef(null);

  useEffect(() => {
    // Création d'une connexion WebSocket native
    socketRef.current = new WebSocket(url);

    // Gestion des événements
    socketRef.current.onopen = () => {
      console.log('Connexion WebSocket établie');
    };

    socketRef.current.onmessage = (event) => {
      console.log('Message reçu:', event.data);
      onMessage(event.data);
    };

    socketRef.current.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };

    socketRef.current.onclose = () => {
      console.log('Connexion WebSocket fermée');
    };

    // Nettoyage
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url, onMessage]);

  return socketRef;
};