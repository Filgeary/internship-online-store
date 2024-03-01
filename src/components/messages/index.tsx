import './style.css';
import React, { createContext, memo, useContext, useRef } from 'react';

import { cn as bem } from '@bem-react/classname';

import MessagesArea from './messages-area';
import MessagesNew from './messages-new';
import MessagesTitle from './messages-title';

import { TMessagesContext } from './types';
import { TMessage } from '@src/chat/types';
import Spinner from '../spinner';

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
  onScrollTop: () => void;
  loading?: boolean;
};

function Messages(props: MessagesProps) {
  const { children, messages, userId, loading } = props;

  const cn = bem('Messages');

  return (
    <div className={cn()}>
      {loading && 'Загрузка'}
      <MessagesContext.Provider value={{ messages, userId, onScrollTop: props.onScrollTop }}>
        {children}
      </MessagesContext.Provider>
    </div>
  );
}

export default {
  Root: memo(Messages),
  Title: memo(MessagesTitle),
  Area: memo(MessagesArea),
  New: memo(MessagesNew),
};
