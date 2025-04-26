"use client";
import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export function useSocket() {
  const { data: session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!session?.user) return;

    // Initialize socket connection
    if (!socketRef.current) {
      socketRef.current = io({
        path: '/api/socket',
        autoConnect: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      const socket = socketRef.current;

      socket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
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
    subscribeToNewMessages,
    subscribeToTyping,
    sendTypingStatus,
    markMessagesAsRead,
    subscribeToMessagesRead
  };
}