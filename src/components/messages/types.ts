import { TMessage } from '@src/chat/types';
import React from 'react';

export type TMessagesContext = {
  messages: TMessage[];
  userId: string;
  onScrollTop: () => void;
  onBottom: boolean;
  setOnBottom: React.Dispatch<React.SetStateAction<boolean>>;
  messagesAreaRef: React.RefObject<HTMLDivElement>;
};
