import { useEffect, useState } from 'react';

const url = 'ws://example.front.ylab.io/chat';

// generate unique id with modern WEB API crypto
const uuid = self.crypto.randomUUID();

interface Message {
  _id: string;
  _key: string;
  text: string;
  author: {
    _id: string;
    username: string;
    profile: {
      name: string;
      avatar: {
        url: string;
      };
    };
  };
  dateCreate: Date;
}

export const useChat = (token: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const newSocket = new WebSocket(url);

    newSocket.onopen = () => {
      console.log('WebSocket connection established');
      // Аутентификация
      newSocket.send(
        JSON.stringify({
          method: 'auth',
          payload: {
            token,
          },
        }),
      );
    };

    newSocket.onmessage = event => {
      const data = JSON.parse(event.data) as {
        method: string;
        payload: any;
      };

      switch (data.method) {
        case 'auth':
          if (data.payload.success) {
            console.log('Authentication successful');
          } else {
            setError(data.payload.error);
          }
          break;
        case 'post':
          setMessages(prevMessages => [...prevMessages, data.payload]);
          break;
        case 'last':
        case 'old':
          setMessages(prevMessages => [...data.payload, ...prevMessages]);
          break;
        case 'clear':
          setMessages([]);
          break;
        default:
          console.warn('Unknown message received:', data);
      }
    };

    newSocket.onerror = error => {
      console.error('WebSocket error:', error);
    };

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [token]);

  const sendMessage = (text: string) => {
    if (!socket) {
      return;
    }

    const message: Pick<Message, '_key' | 'text'> = {
      _key: uuid,
      text,
    };

    socket.send(
      JSON.stringify({
        method: 'post',
        payload: message,
      }),
    );
  };

  const loadLastMessages = (fromDate?: Date) => {
    if (!socket) {
      return;
    }

    socket.send(
      JSON.stringify({
        method: 'last',
        payload: {
          fromDate,
        },
      }),
    );
  };

  const loadOldMessages = (fromId: string) => {
    if (!socket) {
      return;
    }

    socket.send(
      JSON.stringify({
        method: 'old',
        payload: {
          fromId,
        },
      }),
    );
  };

  const clearAllMessages = () => {
    if (!socket) {
      return;
    }

    socket.send(
      JSON.stringify({
        method: 'clear',
        payload: {},
      }),
    );
  };

  return {
    messages,
    error,
    sendMessage,
    loadLastMessages,
    loadOldMessages,
    clearAllMessages,
  };
};
