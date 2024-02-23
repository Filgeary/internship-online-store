import { TMessage } from '@src/containers/messages-wrapper/types';

export type TMessagesContext = {
  messages: TMessage[];
  userId: string;
};
