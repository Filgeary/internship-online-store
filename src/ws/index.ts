import Services from "@src/services";
import { ConfigWS } from "./type";
import { MessageType } from "@src/store/seance/type";

class WSService {
  services: Services;
  config: ConfigWS;
  messages: MessageType[];
  listeners: ((message: MessageType) => void)[];
  ws?: WebSocket;

  constructor(services: Services, config = {} as ConfigWS) {
    this.services = services;
    this.config = config;
    this.listeners = [];
    this.messages = [];
  }

  auth(token: string) {
    this.ws = new WebSocket(this.config.url);

    this.ws.addEventListener("open", () => {
      this.ws?.send(
        JSON.stringify({
          method: "auth",
          payload: {
            token,
          },
        })
      );
    });

  }

  close() {
    this.ws?.close();
  }

  subscribe(listener: (message: MessageType) => void): () => void {
    this.listeners.push(listener);
    // Возвращается функция для удаления добавленного слушателя
    return () => {
      this.listeners = this.listeners.filter((item) => item !== listener);
    };
  }

  getSnapshot() {
    return this.messages;
  }
}

export default WSService;
