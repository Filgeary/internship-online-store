import Messages from '@src/components/messages';
import { useAppSelector } from '@src/hooks/use-selector';
import { useEffect, useRef, useState } from 'react';

const url = 'ws://example.front.ylab.io/chat';

function MessagesWrapper() {
  const select = useAppSelector((state) => ({
    token: state.session.token,
  }));
  const [messages, setMessages] = useState([]);

  const ws = useRef(null);

  const handlers = {
    writeNewMessage: (data: string) => {
      console.log({ data });
    },
  };

  /* Взаимодействие с сокетом */
  /* @todo: Вынести в сервис (?) */
  useEffect(() => {
    const openListener = () => {
      console.log('Open connection');
      const body = JSON.stringify({
        method: 'auth',
        payload: {
          token: select.token,
        },
      });
      ws.current.send(body);
    };

    const messageListener = (event: any) => {
      console.log('Message received:', event.data);
    };

    ws.current = new WebSocket(url);

    ws.current.addEventListener('open', openListener);
    ws.current.addEventListener('message', messageListener);

    return () => {
      ws.current?.addEventListener('open', openListener);
      ws.current?.addEventListener('message', messageListener);
    };
  }, []);

  return (
    <Messages.Root messages={messages}>
      <Messages.Title>Чат сообщества</Messages.Title>
      <Messages.Area />
      <Messages.New onSubmit={handlers.writeNewMessage} />
    </Messages.Root>
  );
}

export default MessagesWrapper;
