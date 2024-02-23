import Messages from '@src/components/messages';
import { useAppSelector } from '@src/hooks/use-selector';
import { useEffect, useRef, useState } from 'react';
import { TMessage } from './types';

const url = 'ws://localhost:8010/chat';

function MessagesWrapper() {
  const select = useAppSelector((state) => ({
    token: state.session.token,
    userId: state.session.user._id,
  }));
  const [messages, setMessages] = useState<TMessage[]>([]);

  const ws = useRef(null);

  const handlers = {
    writeNewMessage: (data: string) => {
      console.log({ data });
      const bodyObj = {
        method: 'post',
        payload: {
          _key: window.crypto.randomUUID(),
          text: data,
        },
      };
      ws.current.send(JSON.stringify(bodyObj));
    },
  };

  /* Взаимодействие с сокетом */
  /* @todo: Вынести в сервис (?) */
  useEffect(() => {
    const openListener = () => {
      console.log('Open connection');

      ws.current.send(
        JSON.stringify({
          method: 'auth',
          payload: {
            token: select.token,
          },
        })
      );
    };

    const messageListener = (event: any) => {
      const jsonObj = JSON.parse(event.data);
      console.log('Message received:', jsonObj);
      switch (jsonObj.method) {
        case 'auth': {
          if (jsonObj.payload.result) {
            console.log('Успешно вошли!');
            const bodyObj = {
              method: 'last',
              payload: {
                fromDate: '2022-03-04T09:25:17.146Z',
              },
            };
            ws.current.send(JSON.stringify(bodyObj));
          }
          break;
        }
        case 'last': {
          const messages = jsonObj.payload.items as TMessage[];
          setMessages(messages);
          break;
        }
        case 'post': {
          setMessages((prevMessages) => [...prevMessages, jsonObj.payload]);
          break;
        }
      }
    };

    ws.current = new WebSocket(url);

    ws.current.addEventListener('open', openListener);
    ws.current.addEventListener('message', messageListener);

    return () => {
      ws.current?.addEventListener('open', openListener);
      ws.current?.addEventListener('message', messageListener);
      ws.current.close();
    };
  }, []);

  return (
    <Messages.Root userId={select.userId} messages={messages}>
      <Messages.Title>Чат сообщества</Messages.Title>
      <Messages.Area />
      <Messages.New onSubmit={handlers.writeNewMessage} />
    </Messages.Root>
  );
}

export default MessagesWrapper;
