import Messages from '@src/components/messages';
import { useAppSelector } from '@src/hooks/use-selector';
import { useEffect } from 'react';
import { useChat } from '@src/chat/context';

function MessagesWrapper() {
  const select = useAppSelector((state) => ({
    token: state.session.token,
    user: state.session.user,
  }));
  const { chatService, messages } = useChat();

  const handlers = {
    sendNewMessage: (data: string) => {
      //@ts-ignore
      chatService.sendMessage(data, select.user);
    },
  };

  useEffect(() => {
    chatService.auth(select.token, select.user._id);

    return () => chatService.close();
  }, []);

  return (
    <Messages.Root userId={select.user._id} messages={messages}>
      <Messages.Title>Чат сообщества</Messages.Title>
      <Messages.Area />
      <Messages.New onSubmit={handlers.sendNewMessage} />
    </Messages.Root>
  );
}

export default MessagesWrapper;
