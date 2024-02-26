export type ConfigWS = {
  baseUrl: string;
}

export type MessageType = {
  _id: string;
  _key: string;
  text: string;
  author: Author;
  dateCreate: string;
  sended?: boolean;
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
