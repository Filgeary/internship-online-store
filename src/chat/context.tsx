import React, { createContext, useContext, useSyncExternalStore } from 'react';

import useServices from '@src/hooks/use-services';
import ChatService from '.';

import { TMessage } from './types';

type TChatContext = {
  chatService: ChatService;
  messages: TMessage[];
  waiting: boolean;
  connected: boolean;
};

const ChatContext = createContext<TChatContext>(null);

type ChatProviderProps = {
  children: React.ReactNode;
};

export function ChatProvider({ children }: ChatProviderProps) {
  const chatService = useServices().chat;
  const { messages, waiting, connected } = useSyncExternalStore(
    (listener) => chatService.subscribe(listener),
    () => chatService.getSnapshot()
  );

  const ctxValue = {
    chatService,
    messages,
    waiting,
    connected,
  };

  return <ChatContext.Provider value={ctxValue}>{children}</ChatContext.Provider>;
}

export const useChat = (): TChatContext => {
  const ctx = useContext(ChatContext);

  if (!ctx) {
    throw new Error('Компоненты, использующие сервис чата должны быть обёрнуты в <ChatProvider />');
  }

  return ctx;
};
