export type TMessage = {
  _id: string;
  _key: string;
  text: string;
  author: TProfile | TAuthor;
  dateCreate: string;
  sended?: boolean;
  alreadyDone?: boolean;
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

export type TListeners = 'onAuth' | 'onLast' | 'onPost';
export type TResponse<T> = {
  payload: T;
};
