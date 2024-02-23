import { TMessage } from '@src/chat/types';

export type TMessagesContext = {
  messages: TMessage[];
  userId: string;
};
