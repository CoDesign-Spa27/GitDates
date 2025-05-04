"use client";
import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export function useSocket() {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const [socketToken, setSocketToken] = useState<string | null>(null);

  // Fetch socket token on session change
  useEffect(() => {
    async function fetchSocketToken() {
      if (!session?.user) return;

      try {
        const response = await fetch('/api/socket-token');
        if (!response.ok) {
          throw new Error('Failed to fetch socket token');
        }

        const data = await response.json();
        setSocketToken(data.token);
      } catch (error) {
        console.error('Error fetching socket token:', error);
        setConnectionError('Failed to authenticate socket connection');
      }
    }

    fetchSocketToken();
  }, [session]);

  // Initialize socket connection when token is available
  useEffect(() => {
    if (!socketToken) return;

    // Initialize socket connection
    if (!socketRef.current) {
      socketRef.current = io({
        path: '/api/socket',
        autoConnect: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
        auth: {
          token: socketToken
        }
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected', reason);
        setIsConnected(false);

        if (reason === 'io server disconnect') {
          socket.connect();
        }
      });

      socket.on('connect_error', (error) => {
        console.error('Socket error:', error);
        setConnectionError(error.message);
        reconnectAttemptsRef.current += 1;
        if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setConnectionError('Failed to connect after multiple attempts');
        }
      });

      socket.on('error', (error) => {
        console.error('Socket error event:', error);
        setConnectionError(error.message);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [socketToken]);

  const sendMessage = useCallback((conversationId: string, content: string) => {
    if (socketRef.current && isConnected) {
      console.log('Emitting sendMessage event to socket', { conversationId, content });
      socketRef.current.emit('sendMessage', { conversationId, content });
      return true;
    }
    console.log('Cannot send message - socket disconnected or not initialized');
    return false;
  }, [isConnected]);

  const subscribeToNewMessages = useCallback((callback: (message: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('newMessage', callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('newMessage', callback);
      }
    };
  }, []);
  const subscribeToTyping = useCallback((callback: (data: { userId: string, isTyping: boolean }) => void) => {
    const socket = socketRef.current;
    if (!socket) {
      console.warn('Socket is not connected yet when trying to subscribe to typing.');
      return () => { };
    }

    socket.on('userTyping', callback);
    return () => {
      socket.off('userTyping', callback);
    };
  }, []);
  const sendTypingStatus = useCallback((conversationId: string, isTyping: boolean) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing', { conversationId, isTyping });
    }
  }, [isConnected]);

  const markMessagesAsRead = useCallback((conversationId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('markAsRead', { conversationId });
    }
  }, [isConnected]);

  const subscribeToMessagesRead = useCallback((callback: (data: { conversationId: string, readBy: string }) => void) => {
    if (socketRef.current) {
      socketRef.current.on('messagesRead', callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('messagesRead', callback);
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    sendMessage,
    connectionError,
    subscribeToNewMessages,
    subscribeToTyping,
    sendTypingStatus,
    markMessagesAsRead,
    subscribeToMessagesRead
  };
}