import React, { createContext, memo, useContext, useEffect, useRef, useState } from 'react';

import { cn as bem } from '@bem-react/classname';

import MessagesArea from './messages-area';
import MessagesNew from './messages-new';
import messagesTitle from './messages-title';
import { TMessage } from '@src/containers/messages-wrapper/types';

const MessagesContext = createContext(null);

export const useMessagesContext = () => {
  const ctx = useContext(MessagesContext);

  if (!ctx) {
    throw new Error('Компоненты сообщений должны быть обёрнуты в <Messages.Root />');
  }

  return ctx;
};

type MessagesProps = {
  children: React.ReactNode;
  messages: TMessage[];
};

function Messages(props: MessagesProps) {
  const { children } = props;

  const cn = bem('Messages');

  return (
    <div className={cn()}>
      <MessagesContext.Provider value={{ messages: props.messages }}>
        {children}
      </MessagesContext.Provider>
    </div>
  );
}

export default {
  Root: memo(Messages),
  Title: memo(messagesTitle),
  Area: memo(MessagesArea),
  New: memo(MessagesNew),
};
