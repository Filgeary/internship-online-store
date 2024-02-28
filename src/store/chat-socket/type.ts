export type TConfigWS = {
  baseUrl: string;
};

export type TChatState = {
  ws: WebSocket | null;
  connection: boolean;
  messages: TMessage[];
  timeId: string | number | NodeJS.Timeout | undefined;
  waiting:boolean,
  fromId:string
};

export type TMessage = {
  _id: string;
  _key: string;
  text: string;
  author: TAuthor;
  dateCreate: string;
};

export type TAuthor = {
  _id: string;
  username: string;
  profile: {
    name: string;
    avatar: {
      url: string;
    };
  };
}

