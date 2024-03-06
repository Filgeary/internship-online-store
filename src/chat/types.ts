export type ChatConfig = {
  baseUrl: string;
};

export type TMessageMethods = {
    onTextMessage?: (data: TMessageResponse) => void;
    onAuthMessage?: (data: TAuthResponse) => void;
    onLastMessages?: (data: TLastMessagesResponse) => void;
}

export type IConnectProps = {
  token: string;
} & TMessageMethods;


export type IBaseResponse = IMessageResponse | IAuthResponse | ILastMessagesResponse;

export type TMessageResponse = IMessageResponse["payload"];
export type TAuthResponse = IAuthResponse["payload"];
export type TLastMessagesResponse = ILastMessagesResponse["payload"];


interface IMessageResponse {
  method: "post";
  payload: {
    _id: string;
    _key: string;
    text: string;
    author: {
      _id: string;
      username: string;
      profile: { name: string; avatar: { url: string } };
    };
    dateCreate: string;
  };
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
        items: IMessageResponse["payload"][]
    }
}
