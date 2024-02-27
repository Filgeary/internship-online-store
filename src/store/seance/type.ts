export type ConfigWS = {
  url: string;
};

export type InitialStateSeance = {
  ws: WebSocket | null;
  connection: boolean;
  messages: MessageType[];
  timeId: string | number | NodeJS.Timeout | undefined;
};

export type MessageType = {
  _id: string;
  _key: string;
  text: string;
  author: Author;
  dateCreate: string;
};

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

