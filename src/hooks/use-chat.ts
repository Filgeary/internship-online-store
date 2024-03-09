import { useEffect, useState } from 'react';

import { sortByDate } from '@src/utils/sortByDate';
import { uniqBy } from '@src/utils/uniqBy';

const url = 'ws://example.front.ylab.io/chat';

// generate unique id with modern WEB API crypto
const createUUID = () => self.crypto.randomUUID();

export interface IMessage {
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
      payload: IMessage;
    }
  | {
      method: 'last' | 'old';
      payload: {
        items: IMessage[];
      };
    }
  | {
      method: 'clear';
    };

export const useChat = (token: string) => {
  const [isAuth, setIsAuth] = useState(false);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isInitialFetching, setIsInitialFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
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
            setIsInitialFetching(true);
            setError(data.payload.error);
          }
          setIsLoading(false);
          break;
        case 'post':
          setMessages(prevMessages => uniqBy([...prevMessages, data.payload], item => item._id));
          setIsLoading(false);
          break;
        case 'last':
        case 'old':
          setMessages(prevMessages =>
            uniqBy([...data.payload.items, ...prevMessages], item => item._id).toSorted(sortByDate),
          );
          setIsLoading(false);
          setIsInitialFetching(false);
          break;
        case 'clear':
          setMessages([]);
          setIsLoading(false);
          break;
        default:
          console.warn('Unknown message received:', data);
      }
    };

    newSocket.onerror = error => {
      setIsLoading(false);
      console.error('WebSocket error:', error);
    };

    newSocket.onclose = evt => {
      setIsLoading(false);
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
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }
    setIsLoading(true);
    const messageID = createUUID();
    setUniqueUUIDs(prevUUIDs => [...(prevUUIDs || []), messageID]);

    const message: Pick<IMessage, '_key' | 'text'> = {
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
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }
    setIsLoading(true);

    socket.send(
      JSON.stringify({
        method: 'last',
        payload: {
          fromDate,
        },
      }),
    );
  };

  const loadOldMessagesFromID = (fromId: string) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }
    setIsLoading(true);

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
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }
    setIsLoading(true);

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
    isInitialFetching,
    isLoading,
    messages,
    error,
    sendMessage,
    loadLastMessages,
    loadOldMessagesFromID,
    clearAllMessages,
  };
};
