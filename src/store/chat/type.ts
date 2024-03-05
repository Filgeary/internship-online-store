export type ConfigWS = {
  url: string;
};

export type InitialStateChat = {
  messages: MessageType[];
  fromId?: string,
  timeId: number | string | NodeJS.Timeout,
  connection: boolean
};

export type MessageType = {
  _id: string;
  _key: string;
  text: string;
  author: Author;
  dateCreate: string;
  status?: StatusType
};
export type StatusType = 'pending' | 'sent' | 'read';

export type Author = {
  _id?: string;
  username?: string;
  profile?: {
    name: string;
    avatar: {
      url: string;
    };
  };
}
