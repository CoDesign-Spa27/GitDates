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
  const maxReconnectAttempts = 2;
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
        auth: {
          token: socketToken
        }
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
 
        setIsConnected(true);
        setConnectionError(null);
        reconnectAttemptsRef.current = 0;
      });

      socket.on('disconnect', (reason) => {
 
        setIsConnected(false);

        if (reason === 'io server disconnect') {
          socket.connect();
        }
      });

      socket.on('connect_error', (error) => {
 
        setConnectionError(error.message);
        reconnectAttemptsRef.current += 1;
        if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setConnectionError('Failed to connect after multiple attempts');
        }
      });

      socket.on('error', (error) => {
 
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
      socketRef.current.emit('sendMessage', { conversationId, content });
      return true;
    }
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
    if (!socketRef.current) {
      return () => {};
    }
    socketRef.current.on('userTyping', callback);
    return () => {
      socketRef.current?.off('userTyping', callback);
    };
  }, []);

  const sendTypingStatus = useCallback((conversationId: string, isTyping: boolean) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing', { conversationId, isTyping });
      return true;
    }
    return false;
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

  const subscribeToOnlineUser = useCallback((callback: (onlineUsers: string[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on('onlineUsers', callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('onlineUsers', callback);
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
    subscribeToMessagesRead,
    subscribeToOnlineUser
  };
}