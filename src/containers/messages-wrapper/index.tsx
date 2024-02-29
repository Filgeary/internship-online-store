import Messages from '@src/components/messages';

import { useAppSelector } from '@src/hooks/use-selector';
import { useEffect } from 'react';
import { useChat } from '@src/chat/context';
import useTranslate from '@src/hooks/use-translate';

function MessagesWrapper() {
  const select = useAppSelector((state) => ({
    token: state.session.token,
    user: state.session.user,
  }));
  const { chatService, messages, waiting } = useChat();

  const { t } = useTranslate();

  const handlers = {
    sendNewMessage: (data: string) => {
      chatService.sendMessage(data, select.user);
    },

    getOldMessages: () => {
      chatService.requestOldMessages();
    },
  };

  useEffect(() => {
    chatService.auth(select.token, select.user._id);
    return () => chatService.close();
  }, []);

  return (
    <Messages.Root
      onScrollTop={handlers.getOldMessages}
      userId={select.user._id}
      messages={messages}
      loading={waiting}
    >
      <Messages.Title>{t('titleInner.community')}</Messages.Title>
      <Messages.Area />
      <Messages.New onSubmit={handlers.sendNewMessage} />
    </Messages.Root>
  );
}

export default MessagesWrapper;
