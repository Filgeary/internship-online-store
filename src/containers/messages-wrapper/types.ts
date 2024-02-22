export type TMessage = {
  _id: string;
  _key: string;
  text: string;
  author: {
    _id: string;
    username: string;
    profile: {
      name: string;
      avatar: {
        url: string;
      };
    };
  };
  dateCreate: string;
};
