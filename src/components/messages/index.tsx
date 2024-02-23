import './style.css';
import React, { createContext, memo, useContext } from 'react';

import { cn as bem } from '@bem-react/classname';

import MessagesArea from './messages-area';
import MessagesNew from './messages-new';
import messagesTitle from './messages-title';
import { TMessagesContext } from './types';
import { TMessage } from '@src/chat/types';

const MessagesContext = createContext<TMessagesContext>(null);

export const useMessagesContext = (): TMessagesContext => {
  const ctx = useContext(MessagesContext);

  if (!ctx) {
    throw new Error('Компоненты сообщений должны быть обёрнуты в <Messages.Root />');
  }

  return ctx;
};

type MessagesProps = {
  children: React.ReactNode;
  userId: string;
  messages: TMessage[];
};

function Messages(props: MessagesProps) {
  const { children, messages, userId } = props;

  const cn = bem('Messages');

  return (
    <div className={cn()}>
      <MessagesContext.Provider value={{ messages, userId }}>{children}</MessagesContext.Provider>
    </div>
  );
}

export default {
  Root: memo(Messages),
  Title: memo(messagesTitle),
  Area: memo(MessagesArea),
  New: memo(MessagesNew),
};
