export type ConfigWS = {
  url: string;
};

export type InitialStateChat = {
  ws: WebSocket | null;
  messages: MessageType[];
  fromId?: string,
  keyofMessageSentByMe: string,
};

export type MessageType = {
  _id: string;
  _key: string;
  text: string;
  author: Author;
  dateCreate: string;
  status?: StatusType
};
export type StatusType = 'sent' | 'read';

export type Author = {
  _id: string;
  username: string;
  profile: {
    name: string;
    avatar: {
      url: string;
    };
  };
}
