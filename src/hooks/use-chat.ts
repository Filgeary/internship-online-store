import { useEffect, useState } from 'react';

const url = 'ws://example.front.ylab.io/chat';

// generate unique id with modern WEB API crypto
const createUUID = () => self.crypto.randomUUID();

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

type TResponse =
  | {
      method: 'auth';
      payload: {
        result: boolean;
        error?: string;
      };
    }
  | {
      method: 'post';
      payload: Message;
    }
  | {
      method: 'last' | 'old';
      payload: {
        items: Message[];
      };
    }
  | {
      method: 'clear';
    };

export const useChat = (token: string) => {
  const [isAuth, setIsAuth] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | undefined>(undefined);
  const [uniqueUUIDs, setUniqueUUIDs] = useState<string[] | null>(null);

  useEffect(() => {
    if (!token) return;

    const newSocket = new WebSocket(url);

    newSocket.onopen = () => {
      console.log('WebSocket connection established');
      // Authentication
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
      const data = JSON.parse(event.data) as TResponse;

      switch (data.method) {
        case 'auth':
          if (data.payload.result === true) {
            setIsAuth(true);
            console.log('Authentication successful');
          } else {
            setIsAuth(false);
            setError(data.payload.error);
          }
          break;
        case 'post':
          setMessages(prevMessages => [...prevMessages, data.payload]);
          break;
        case 'last':
        case 'old':
          setMessages(prevMessages => [...data.payload.items, ...prevMessages]);
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

    newSocket.onclose = evt => {
      setError(`WebSocket connection closed`);
      console.error('WebSocket connection closed', evt.code, evt.reason);
      setIsAuth(false);
      setSocket(null);
    };

    // Ping server
    const timerID = setInterval(() => {
      if (!newSocket) {
        return;
      }
      newSocket.send(JSON.stringify({ method: 'ping', payload: {} }));
    }, 30_000);

    setSocket(newSocket);

    return () => {
      newSocket.close();

      if (timerID) {
        clearInterval(timerID);
      }
    };
  }, [token]);

  const sendMessage = (text: string) => {
    if (!socket) {
      return;
    }

    const messageID = createUUID();
    setUniqueUUIDs(prevUUIDs => [...(prevUUIDs || []), messageID]);

    const message: Pick<Message, '_key' | 'text'> = {
      _key: messageID,
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
    uniqueUUIDs,
    isAuth,
    messages,
    error,
    sendMessage,
    loadLastMessages,
    loadOldMessages,
    clearAllMessages,
  };
};
