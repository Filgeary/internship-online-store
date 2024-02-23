export type TMessage = {
  _id: string;
  _key: string;
  text: string;
  author: TAuthor;
  dateCreate: string;
  sended?: boolean;
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
