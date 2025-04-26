"use client";
import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';
import { error } from 'console';

export function useSocket() {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;



  useEffect(() => {
    if (!session?.user) return;

    // Initialize socket connection
    if (!socketRef.current) {
      socketRef.current = io({
        path: '/api/socket',
        autoConnect: true,
        reconnectionAttempts: maxReconnectAttempts,
        reconnectionDelay: 1000,
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        setConnectionError(null)
        reconnectAttemptsRef.current=0
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected',reason);
        setIsConnected(false);

        if(reason === 'io server disconnect'){
          socket.connect();
        }
      });

      socket.on('connect_error', (error) => {
        console.error('Socket error:', error);
        setConnectionError(error.message);
        reconnectAttemptsRef.current +=1
        if(reconnectAttemptsRef.current >= maxReconnectAttempts){
          setConnectionError('Failed to connect after multiple attempts');
        }
      });

      socket.on('error',(error) =>{
        console.log('socket error', error);
        setConnectionError(error.message);
    })
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current=null;
      }
    };
  }, [session]);

  const sendMessage = (conversationId: string, content: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('sendMessage', { conversationId, content });
      return true;
    }
    return false;
  };

  const subscribeToNewMessages = (callback: (message: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on('newMessage', callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('newMessage', callback);
      }
    };
  };

  const subscribeToTyping = (callback: (data: { userId: string, isTyping: boolean }) => void) => {
    if (socketRef.current) {
      socketRef.current.on('userTyping', callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('userTyping', callback);
      }
    };
  };

  const sendTypingStatus = (conversationId: string, isTyping: boolean) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing', { conversationId, isTyping });
    }
  };

  const markMessagesAsRead = (conversationId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('markAsRead', { conversationId });
    }
  };

  const subscribeToMessagesRead = (callback: (data: { conversationId: string, readBy: string }) => void) => {
    if (socketRef.current) {
      socketRef.current.on('messagesRead', callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off('messagesRead', callback);
      }
    };
  };

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