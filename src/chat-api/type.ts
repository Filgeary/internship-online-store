import { MessageType } from "@src/store/chat/type";

export type ConfigWS = {
  url: string;
}

export type MessagePostType = {
  method: 'post',
  payload: MessageType
}

export type ResponseMessagesType = {
  method: "old" | 'last' | 'clear';
  payload:{
    items: MessageType[];
  }
};
