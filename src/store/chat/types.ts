interface IChatInitState {
  list: IMessage[];
  connection: boolean;
  waiting: boolean;
}

interface IChatConfig {
  baseUrl: string;
}

interface IMessage {
  _id: string;
  _key: string;
  text: string;
  status?: "load" | "sent";
  author?: {
    _id: string;
    username?: string;
    profile?: { name: string; avatar: { url: string } };
  };
  dateCreate: string;
}

type IBaseResponse = IMessageResponse | IAuthResponse | ILastMessagesResponse | IOldMessagesResponse;

type TMessageResponse = IMessageResponse["payload"];
type TAuthResponse = IAuthResponse["payload"];
type TLastMessagesResponse = ILastMessagesResponse["payload"];


interface IMessageResponse {
  method: "post";
  payload: IMessage;
}


interface IAuthResponse {
  method: "auth";
  payload: {
    result: boolean;
  };
}

interface ILastMessagesResponse {
    method: "last";
    payload: {
        items: IMessage[]
    }
}

interface IOldMessagesResponse {
  method: "old",
  payload: {
      items: IMessage[]
  }
}