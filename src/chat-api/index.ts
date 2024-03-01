import Services from "@src/services";
import { ConfigWS, MessagePostType, ResponseMessagesType } from './type';
import { MessageType } from "@src/store/chat/type";
import { v4 as uuidv4 } from "uuid";

class ChatApiService {
  services: Services;
  config: ConfigWS;
  listeners: ((data: MessagePostType | ResponseMessagesType) => void)[];
  messages: MessageType[];
  ws?: WebSocket;
  token?: string;

  constructor(services: Services, config = {} as ConfigWS) {
    this.services = services;
    this.config = config;
    this.listeners = [];
    this.messages = [];
  }

  createChannel(url: string | URL) {
    this.ws?.removeEventListener("close", this.closeHandler);
    this.ws?.removeEventListener("open", this.auth);
    this.ws?.close();
    this.ws = new WebSocket(url);
    this.ws?.addEventListener("close", this.closeHandler);
    this.ws?.addEventListener("open", this.auth);
    // this.ws.addEventListener('message', );
    return this.ws;
  }

  setToken(token: string) {
    this.token = token;
  }

  auth() {
    this.ws?.send(
      JSON.stringify({
        method: "auth",
        payload: {
          token: this.token,
        },
      })
    );
  }

  closeHandler() {
    setTimeout(this.createChannel, 1000);
  }

  messageHandler(e: MessageEvent) {
    const data = JSON.parse(e.data);
    this.listeners.forEach((listener) => listener(data));
  }

  sendMessage(message: string) {
    this.ws?.send(
      JSON.stringify({
        method: "post",
        payload: {
          _key: uuidv4(), // любым способом генерируем уникальный ключ
          text: message,
        },
      })
    );
  }

  //получить последние сообщения, если не указать дату, придут последние 10 сообщений
  getLastMessages(fromDate?: string) {
    this.ws?.send(
      JSON.stringify({
        method: "last",
        payload: {
          fromDate,
        },
      })
    );
  }

  //получение старых сообщений начиная с конкретного сообщения(id)
  getOldMessages(fromId?: string) {
    this.ws?.send(
      JSON.stringify({
        method: "old",
        payload: {
          fromId,
        },
      })
    );
  }

  //очистить все сообщения
  clearAll() {
    this.ws?.send(
      JSON.stringify({
        method: "clear",
        payload: {},
      })
    );
  }

  subscribe(listener: (data: MessagePostType | ResponseMessagesType) => void) {
    this.listeners.push(listener);
    return () =>
      (this.listeners = this.listeners.filter((item) => item !== listener));
  }
}

export default ChatApiService;
