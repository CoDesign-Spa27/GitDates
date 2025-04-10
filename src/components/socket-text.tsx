'use client'

import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export default function Chat() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io({
      path: '/api/socket'
    });

    // Connection handlers
    socketRef.current.on('connect', () => {
      console.log('Connected to socket server');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from socket server');
    });

    // Message handler
    socketRef.current.on('message', (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('message');
        socketRef.current.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() && socketRef.current?.connected) {
      socketRef.current.emit('message', input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">WebSocket Chat</h1>
      <div className="border rounded-lg p-4 mb-4 h-64 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet</p>
        ) : (
          <ul className="space-y-2">
            {messages.map((msg, index) => (
              <li key={index} className="p-2 bg-neutral-400 text-black rounded">
                {msg}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}