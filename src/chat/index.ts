import Services from "../services";
import {
  PostMessageType,
  ServerResponce,
  ServerResponceMulti,
  ServerResponcePost,
} from "../types/chat";
import { ConfigChatType } from "../types/config";

class ChatService {
  private _services: Services;
  private _config: ConfigChatType;
  private _ws: WebSocket;
  private _token: string;
  private _listeners: ((e: ServerResponcePost | ServerResponceMulti) => void)[];

  constructor(services: Services, config: ConfigChatType) {
    this._services = services;
    this._config = config;
    this._listeners = [];
  }

  setToken(token: string | null) {
    this._token = token;
  }

  subscribe(listener: (e: ServerResponcePost | ServerResponceMulti) => void) {
    this._listeners = [...this._listeners, listener];

    return () => {
      this._listeners = this._listeners.filter((item) => item !== listener);
    };
  }

  /**
   * Первоначальный запрос всех данных
   */
  initialRequest() {
    this.setConnection();
    this.onInitialRequest();
  }

  /**
   * Установка соединения с сервером чата
   */
  private setConnection() {
    this._ws = new WebSocket(this._config.url);
    this._ws.onopen = () => this.onOpenConnection();
    this._ws.onmessage = (e) => this.onMessageRecieve(e);
    this._ws.onclose = (e) => this.onConnectionClose(e);
    this._ws.onerror = (e) => console.log(e);
  }

  /**
   *
   * @param message Отправка нового сообщения
   */
  sendMessage(message: PostMessageType) {
    this._ws.send(
      JSON.stringify({
        method: "post",
        payload: {
          _key: message._key,
          text: message.text,
        },
      })
    );
  }

  requestOldMessages(fromId: string) {
    this._ws.send(
      JSON.stringify({
        method: "old",
        payload: {
          fromId,
        }
      })
    )
  }

  private onOpenConnection() {
    if (this._ws.readyState === 1) {
      this._ws.send(
        JSON.stringify({
          method: "auth",
          payload: {
            token: this._token,
          },
        })
      );
    } else {
      setTimeout(() => this.onOpenConnection(), 1000);
    }
  }

  private onInitialRequest() {
    if (this._ws.readyState === 1) {
      this._ws.send(
        JSON.stringify({
          method: "last",
          payload: {
            // fromDate: "2023-02-23T00:00:00.146Z",
          },
        })
      );
    } else {
      setTimeout(() => this.onInitialRequest(), 1000);
    }
  }

  private onConnectionClose(e: CloseEvent) {
    console.log(e);
    if (e.code === 1006) {
      setTimeout(() => this.setConnection(), 1000);
    }
  }

  private onMessageRecieve(e: MessageEvent) {
    console.log(e);
    const responce: ServerResponce = JSON.parse(e.data);
    switch (responce.method) {
      case "post":
        for (const cb of this._listeners) {
          cb(responce as ServerResponcePost);
        }
        break;
      case "old":
        for (const cb of this._listeners) {
          cb(responce as ServerResponceMulti);
        }
        break;
      case "last":
        for (const cb of this._listeners) {
          cb(responce as ServerResponceMulti);
        }
        break;
      default:
        break;
    }
  }
}

export default ChatService;
