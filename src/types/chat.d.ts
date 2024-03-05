export type ChatItemType = {
  _id: string;
  _key: string;
  text: string;
  dateCreate: string;
  author: {
    _id: string;
   profile: {
    name: string;
   };
  }
  status?: "pending" | "sended";
}

export type PostMessageType = {
  _key: string;
  text: string;
}

export type ServerResponce = {
  method: "post" | "last" | "old";
  payload: any;
  error?: string;
}

export type ServerResponcePost = {
  method: "post";
  payload: ChatItemType;
}

export type ServerResponceMulti = {
  method: "last" | "old";
  payload: {
    items: ChatItemType[];
  }
}


