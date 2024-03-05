import {
  PostMessageType,
  ServerResponce,
  ServerResponceMulti,
  ServerResponcePost,
} from "../../types/chat";

class ChatWebSocket {
  private _url: string;
  private _ws: WebSocket;
  private _token: string;
  private _listeners: ((e: ServerResponcePost | ServerResponceMulti) => void)[];
  private _timerInterval: NodeJS.Timer;

  constructor(url: string, token: string) {
    this._url = url;
    this._token = token;
    this._listeners = [];
  }

  private subscribe(
    listener: (e: ServerResponcePost | ServerResponceMulti) => void
  ) {
    this._listeners = [...this._listeners, listener];

    return () => {
      this._listeners = this._listeners.filter((item) => item !== listener);
    };
  }

  /**
   * Первоначальный запрос всех данных
   */
  openConnection( listener: (e: ServerResponcePost | ServerResponceMulti) => void) {
    this.subscribe(listener);
    this.setConnection();
    this.onInitialRequest();
  }

  restoreConnection(listener: (e: ServerResponcePost | ServerResponceMulti) => void, fromDate: string) {
    this.subscribe(listener);
    this.setConnection();
    this.onRestoreConnection(fromDate);
  }

  /**
   * Закрытие соединения
   */
  closeConnection() {
    this._ws.close(1000, "User request closing");
  }

  /**
   * Установка соединения с сервером чата
   */
  private setConnection() {
    this._ws = new WebSocket(this._url);
    this._ws.onopen = () => this.onOpenConnection();
    this._ws.onmessage = (e) => this.onMessageRecieve(e);
    this._ws.onclose = (e) => this.onConnectionClose(e);
    this._ws.onerror = (e) => console.log(e);

    this._timerInterval = setInterval(() => this.ping(), 45000);
  }

  private ping() {
      if (this._ws.readyState === 1) {
        this._ws.send("ping");
      }
  }

  /**
   *
   * @param message Отправка нового сообщения
   */
  sendMessage(message: PostMessageType) {
  //  setTimeout(() => {
      this._ws.send(
        JSON.stringify({
          method: "post",
          payload: {
            _key: message._key,
            text: message.text,
          },
        })
      );
  //  }, 3000)
  }

  requestOldMessages(fromId: string) {
    this._ws.send(
      JSON.stringify({
        method: "old",
        payload: {
          fromId,
        },
      })
    );
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

  private onRestoreConnection(fromDate: string) {
    if(this._ws.readyState === 1) {
      this._ws.send(
        JSON.stringify({
          method: 'last',
          payload: {
            fromDate
          },
        })
      );
    } else {
      setTimeout(() => this.onRestoreConnection(fromDate), 1000);
    }
  }

  private onConnectionClose(e: CloseEvent) {
    console.log(e);
    if (e.wasClean) {
      clearInterval(this._timerInterval);
      return;
    }
    if (e.code === 1006) {
      setTimeout(() => this.setConnection(), 1000);
    }
  }

  private onMessageRecieve(e: MessageEvent) {
    const responce: ServerResponce = JSON.parse(e.data);
    switch (responce.method) {
      case "post":
        if(!responce.error) {
          for (const cb of this._listeners) {
            cb(responce as ServerResponcePost);
          }
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

export default ChatWebSocket;
