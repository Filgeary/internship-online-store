export type TChatState = {
  connection: boolean;
  messages: TMessage[];
  timeId:  ReturnType<typeof setTimeout> | null 
  waiting: boolean;
  fromId: string;
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
};

export type TLastMessages = {
  method: string;
  payload: {
    items: TMessage[];
  };
};

export type TOldMessages = {
  method: string;
  payload: TMessage;
};

export type TMessages = TLastMessages | TOldMessages;
